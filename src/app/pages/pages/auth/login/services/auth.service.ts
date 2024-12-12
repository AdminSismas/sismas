import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environments';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _token: string | null = null;

  private urlEndpoint = `${environment.url}:${environment.port}/auth/login`;

  constructor(private http: HttpClient) {}

  public get token(): string | null {
    if (this._token != null) {
      return this._token;
    }
    if (this._token == null && (sessionStorage == null || sessionStorage.getItem('token') == null)) {
      return null;
    }

    this._token = sessionStorage.getItem('token');
    return this._token;
  }

  saveToken(access_token: string) {
    this._token = access_token;
    try {
      sessionStorage.setItem("token",this._token);
    } catch (error) {
    }
  }

  refreshToken() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<any>(this.urlEndpoint,httpOptions);
  }
}
