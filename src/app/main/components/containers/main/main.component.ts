import { AfterViewInit, Component, OnDestroy, OnInit } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { APIService } from '../../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { getUserInfo } from '../../features/user-info/user-info';
import { UserActionComponent } from '../../features/user-action/user-action.component';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatButtonModule, HttpClientModule, UserActionComponent],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent implements OnInit {
  constructor(private apiService: APIService) {}

  ngOnInit(): void {
    this.apiService.postUserData(getUserInfo()).subscribe(
      (response) => {
        console.log('POST Success:', response);
      },
      (error) => {
        console.error('POST Error:', error);
      }
    );
  }
}
