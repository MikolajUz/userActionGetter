import { Component, HostListener } from '@angular/core';
import {
  Subject,
  debounceTime,
  fromEvent,
  merge,
  switchMap,
  takeUntil,
  throttleTime,
  timer,
} from 'rxjs';
import { APIService } from '../../../services/api.service';
import { PLATFORM_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

@Component({
  selector: 'app-user-action',
  standalone: true,
  imports: [],
  templateUrl: './user-action.component.html',
  styleUrl: './user-action.component.scss',
})
export class UserActionComponent {
  constructor(
    private api: APIService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}
  mousePosition: string = '';
  lastClickPosition: string = '';
  scroll: number = 0;

  private destroy$ = new Subject<void>();
  private activity$ = new Subject<void>();
  private accumulatedData: any[] = [];

  ngOnInit(): void {
    if (isPlatformBrowser(this.platformId)) {
      const mouseMove$ = fromEvent<MouseEvent>(document, 'mousemove');
      const click$ = fromEvent<MouseEvent>(document, 'click');
      const scroll$ = fromEvent(window, 'scroll');

      const merged$ = merge(mouseMove$, click$, scroll$);

      const resetTimer$ = this.activity$.pipe(
        debounceTime(3000),
        switchMap(() => timer(3000))
      );

      merge(merged$, resetTimer$)
        .pipe(throttleTime(4000), takeUntil(this.destroy$))
        .subscribe(() => {
          this.sendActivitiesToBackend();
        });

      mouseMove$.pipe(throttleTime(100)).subscribe((event) => {
        this.mousePosition = `(${event.clientX}, ${event.clientY})`;
        this.activity$.next();
        this.accumulateData({
          type: 'mousemove',
          position: this.mousePosition,
        });
      });

      click$.subscribe((event) => {
        this.lastClickPosition = `(${event.clientX}, ${
          event.clientY
        }),element ${event.target as HTMLElement}`;
        this.activity$.next();
        this.accumulateData({
          type: 'click',
          position: this.lastClickPosition,
        });
      });

      scroll$.subscribe((event) => {
        this.scroll = (event.target as Document).documentElement.scrollTop;
        this.activity$.next();
        this.accumulateData({ type: 'scroll', position: this.scroll });
      });
    }
  }

  private accumulateData(data: any): void {
    this.accumulatedData.push(data);
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private sendActivitiesToBackend(): void {
    if (this.accumulateData.length !== 0) {
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
}
