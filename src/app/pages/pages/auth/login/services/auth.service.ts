import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environments';
import { Observable, catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


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
    return this.http.post<any>(this.urlEndpoint, httpOptions);
  }

  // Login
  login(email: string, password: string): Observable<any> {
    const body = { username: email, password: password };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post<any>(this.urlEndpoint, body, httpOptions);
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    return this.token !== null;
  }

  // Logout
  logout(): void {
    this._token = null;
    sessionStorage.removeItem('token');  
    this.router.navigate(['/login']).then(() => {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = function () {
        window.history.pushState(null, '', window.location.href);
      };
    });
  }

  // Decodificar el token y obtener el 'sub'
  getDecodedToken() {
    if (this.token) {
      try {
        const decoded = jwtDecode(this.token);
        return decoded as any;
      } catch (e) {
        console.error('Error al decodificar el token', e);
        return null;
      }
    }
    return null;
  }

  // Obtener datos del usuario usando el 'sub' (nombre de usuario)
  getUserData() {
    const decodedToken = this.getDecodedToken();
    if (decodedToken && decodedToken.sub) {
      const username = decodedToken.sub;
      console.log('Haciendo solicitud para obtener el usuario', username); 
      return this.http.get<any>(`${this.userUrl}${username}`).pipe(
        catchError(err => {
          console.error('Error al obtener el usuario', err);
          return throwError(() => err);
        })
      );
    }
    console.error('Token no disponible o no decodificado');
    return null;
  }
}
