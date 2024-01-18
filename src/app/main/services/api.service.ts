import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { userData } from '../interfaces/userData.interface';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private apiUrl = 'http://localhost:3000';

  constructor(private http: HttpClient) {}

  postAction(postData: userData, type: string): Observable<any> {
    const url = `${this.apiUrl}/${type}`;
    return this.http.post(url, postData);
  }
}
