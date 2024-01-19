import { Component, HostListener } from '@angular/core';
import {
  Subject,
  debounceTime,
  fromEvent,
  merge,
  takeUntil,
  throttleTime,
} from 'rxjs';
import { APIService } from '../../../services/api.service';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

interface MouseMoveData {
  type: 'mousemove';
  position: string;
  time: Date;
}

interface ClickData {
  type: 'click';
  position: string;
  elements: any[];
  time: Date;
}

interface ScrollData {
  type: 'scroll';
  position: number;
  time: Date;
}

type UserData = MouseMoveData | ClickData | ScrollData;

@Component({
  selector: 'app-user-action',
  standalone: true,
  imports: [],
  templateUrl: './user-action.component.html',
  styleUrl: './user-action.component.scss',
})
export class UserActionComponent {
  mousePosition: string = '';
  lastClickPosition: string = '';
  scroll: number = 0;

  private destroy$ = new Subject<void>();
  private activity$ = new Subject<void>();
  private accumulatedData: UserData[] = [];

  constructor(
    private api: APIService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
      const click$ = fromEvent<MouseEvent>(document, 'click');
      const scroll$ = fromEvent(window, 'scroll');

      const merged$ = merge(mouseMove$, click$, scroll$);

      merged$
        .pipe(debounceTime(2000), takeUntil(this.destroy$))
        .subscribe(() => {
          this.sendActivitiesToBackend();
        });

      mouseMove$.pipe(throttleTime(100)).subscribe((event) => {
        this.handleMouseMove(event);
      });

      click$.subscribe((event) => {
        this.handleMouseClick(event);
      });

      scroll$.subscribe((event) => {
        this.handleScroll(event);
      });
    }
  }

  private handleMouseMove(event: MouseEvent): void {
    this.mousePosition = `(${event.clientX}, ${event.clientY})`;
    this.activity$.next();
    this.accumulateData({
      type: 'mousemove',
      position: this.mousePosition,
      time: new Date(),
    });
  }

  private handleMouseClick(event: MouseEvent): void {
    this.lastClickPosition = `(${event.clientX}, ${event.clientY})`;
    const elements = this.getElementsFromPoint(event.clientX, event.clientY);
    this.activity$.next();
    this.accumulateData({
      type: 'click',
      position: this.lastClickPosition,
      elements,
      time: new Date(),
    });
  }

  private handleScroll(event: Event): void {
    this.scroll = (event.target as Document).documentElement.scrollTop;
    this.activity$.next();
    this.accumulateData({
      type: 'scroll',
      position: this.scroll,
      time: new Date(),
    });
  }

  private accumulateData(data: UserData): void {
    this.accumulatedData.push(data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private sendActivitiesToBackend(): void {
    if (this.accumulatedData.length !== 0) {
      this.api.postAction(this.accumulatedData).subscribe(
        (response) => {
          console.log('POST Success:', response);
          this.accumulatedData = [];
        },
        (error) => {
          console.error('POST Error:', error);
        }
      );
    }
  }

  @HostListener('window:beforeunload', ['$event'])
  unloadNotification(): void {
    this.sendActivitiesToBackend();
  }

  private getElementsFromPoint(x: number, y: number): any[] {
    return document.elementsFromPoint(x, y).map((elem) => {
      return {
        type: elem.tagName.toLowerCase(),
        classList: Array.from(elem.classList),
      };
    });
  }
}
