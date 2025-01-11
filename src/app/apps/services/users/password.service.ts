import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as envi } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class PasswordService {

  private base_url = `${envi.url}:${envi.port}${envi.bpm_users}/${envi.password}`;

  constructor(
    private http: HttpClient
  ) { }

  changePassword(username: string, lastPassword: string, newPassword: string ): Observable<any> {
    const url = `${this.base_url}/${username}`;

    const body = { lastPassword, newPassword };

    return this.http.put<any>(url, body);
  }
}
