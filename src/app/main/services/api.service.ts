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

  constructor(private http: HttpClient) {}

  postUserData(postData: userData ): Observable<any> {
    const url = `${this.apiUrl}/userInfo`;
    return this.http.post(url, postData);
  }

  postAction(postData:  any[] ): Observable<any> {
    const url = `${this.apiUrl}/actions`;
    return this.http.post(url, postData);
  }
 


}
