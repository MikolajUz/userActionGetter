import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { userData } from '../interfaces/userData.interface';
import { UserAction } from '../interfaces/userAction.interface';

@Injectable({
  providedIn: 'root',
})
export class APIService {
  private apiUrl = 'http://localhost:3000';
  private userInfoEndpoint = '/userInfo';
  private actionsEndpoint = '/actions';

  constructor(private http: HttpClient) {}

  postUserData(postData: userData): Observable<any> {
    const url = `${this.apiUrl}${this.userInfoEndpoint}`;
    return this.http.post<any>(url, postData);
  }

  postAction(postData: any[]): Observable<any> {
    const url = `${this.apiUrl}${this.actionsEndpoint}`;
    return this.http.post<any>(url, postData);
  }
}
