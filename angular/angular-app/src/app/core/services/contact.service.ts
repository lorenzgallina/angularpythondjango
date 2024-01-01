// user.service.ts
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { BaseService } from './base.service';

@Injectable({
    providedIn: 'root'
  })
  export class UserService extends BaseService<any> {
    constructor(http: HttpClient) {
      super(http, 'users');
    }
  
    getUserDetails(): Observable<any> {
      return this.http.get<any>(`${this.API_URL}/update-user/`, this.httpOptions());
    }
  
    updateUserDetails(data: any): Observable<any> {
      return this.http.put<any>(`${this.API_URL}/update-user/`, data, this.httpOptions());
    }
  
    private httpOptions() {
      return {
        headers: new HttpHeaders({ 'Authorization': 'Bearer ' + localStorage.getItem('token') })
      };
    }
  }
