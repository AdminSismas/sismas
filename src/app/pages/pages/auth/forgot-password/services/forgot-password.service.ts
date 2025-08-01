import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as envi } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class ForgotPasswordService {
  private baseUrl = `${envi.url}:${envi.port}${envi.auth.value}`;

  // Injects
  http = inject(HttpClient);

  sendEmail(email: string): Observable<string> {
    const url = `${this.baseUrl}${envi.auth.forgotPassword}`;
    const params = new HttpParams().set('email', email);

    return this.http.get(url, {
      params,
      responseType: 'text'
    });
  }
}
