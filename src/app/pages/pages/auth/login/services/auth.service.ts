import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environments';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  
   private _token: string | null = null;
  private urlEndpoint = `${environment.url}:${environment.port}/auth/login`;
  private userUrl = `${environment.url}:${environment.port}/bpmUser/username/`;

  constructor(private http: HttpClient, private router: Router) { }

  // Obtener el token
  public get token(): string | null {
    if (this._token) {
      return this._token;
    }

    if (sessionStorage.getItem('token')) {
      this._token = sessionStorage.getItem('token');
      return this._token;
    }
    return null;
  }

  // Guardar el token
  saveToken(access_token: string) {
    this._token = access_token;
    try {
      sessionStorage.setItem('token', this._token);
    } catch (error) {
      console.error('Error al guardar el token', error);
    }
  }

  // Refrescar el token
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
      return this.http.get<any>(`${this.userUrl}${username}`);
    }
    return null;
  }
}
