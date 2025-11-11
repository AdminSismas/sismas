import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as envi } from '@environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ResetPasswordService {
  // Properties
  private baseUrl = `${envi.url}:${envi.port}${envi.auth.value}`;

  // Injects
  private http = inject(HttpClient);

  changePassword(token: string, newPassword: string): Observable<string> {
    const url = `${this.baseUrl}${envi.auth.resetPassword}`;

    const formData = new FormData();
    formData.append('token', token);
    formData.append('newPassword', newPassword);

    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });

    return this.http.post(url, formData, { headers, responseType: 'text' });
  }
}
