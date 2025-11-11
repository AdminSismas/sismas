import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as envi } from '@environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private base_url = `${envi.url}:${envi.port}${envi.bpmUser.value}${envi.password}`;

  constructor(
    private http: HttpClient
  ) { }

  changePassword(userId: number, lastPassword: string, newPassword: string ): Observable<object> {
    const url = `${this.base_url}/${userId}`;

    const body = { lastPassword, newPassword };

    return this.http.put<object>(url, body);
  }
}
