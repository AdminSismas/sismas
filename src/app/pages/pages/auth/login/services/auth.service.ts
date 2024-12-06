import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '../../../../../../environments/environments';
import { Observable } from 'rxjs';
import { Router } from '@angular/router';


@Injectable({
  providedIn: 'root'
})
export class AuthService {

  private _token: string | null = null;

  private urlEndpoint = `${environment.url}:${environment.port}/auth/login`;

  constructor(private http: HttpClient, private router: Router) {}



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

  saveToken(access_token: string) {
    this._token = access_token;
    try {
      sessionStorage.setItem('token', this._token);
    } catch (error) {
      console.error('Error al guardar el token', error);
    }
  }

  // decodeToken(token: string) {
  //   const decoded: any = jwt_decode(token);
  //   console.log(decoded); 
  //   return decoded;
  // }

  // decodeToken(token: string, secret: string) {
  //   try {
     
  //     const decoded = jwt.verify(token, secret);
  //     console.log(decoded); 
  //     return decoded;
  //   } catch (error) {
  //     console.error('Token inválido o expirado');
  //     return null;
  //   }
  // }

  refreshToken() {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<any>(this.urlEndpoint,httpOptions);
  }


  login(email: string, password: string): Observable<any> {
    const body = { username: email, password: password };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post<any>(this.urlEndpoint, body, httpOptions);
  }

  isAuthenticated(): boolean {
    return this.token !== null;
  }


  logout(): void {
    this._token = null;
    sessionStorage.removeItem('token');
    this.router.navigate(['/login']);
  }
}
