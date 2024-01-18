import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { APIService } from '../../../services/api.service';
import { HttpClientModule } from '@angular/common/http';
import { provideHttpClient } from '@angular/common/http';

@Component({
  selector: 'app-main',
  standalone: true,
  imports: [MatButtonModule, HttpClientModule],
  templateUrl: './main.component.html',
  styleUrl: './main.component.scss',
})
export class MainComponent {

  constructor(private apiService: APIService) {}
  post() {
    this.apiService.postAction({ id: 1, data: 'testData' },'actions').subscribe(
      (response) => {
        console.log('POST Success:', response);
      },
      (error) => {
        console.error('POST Error:', error);
      }
    );
  }

}
