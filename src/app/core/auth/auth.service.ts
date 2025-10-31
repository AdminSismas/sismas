import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from '@environments/environments';
import { catchError, Observable, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { jwtDecode } from 'jwt-decode';
import { UserService } from '@shared/services';
import { DecodeJwt, UserDetails } from '@shared/models';
import { DEFAULT_INTERRUPTSOURCES, Idle } from '@ng-idle/core';
import { IDLE_TIME_MINUTES, TIMEOUT_TIME_MINUTES } from '@shared/constants';
import Swal from 'sweetalert2';

@Injectable({
  providedIn: 'root'
})
export class AuthService {


  private _token: string | null = null;
  private urlEndpoint = `${environment.url}:${environment.port}/auth/login`;
  private userUrl = `${environment.url}:${environment.port}/bpmUser/username/`;

  constructor(
    private http: HttpClient, private router: Router,
    private userService: UserService,
    private idle: Idle,
  ) {
    idle.setIdle(IDLE_TIME_MINUTES * 60);
    idle.setTimeout(TIMEOUT_TIME_MINUTES * 60);
    idle.setInterrupts(DEFAULT_INTERRUPTSOURCES);

    // Do something when the user becomes idle
    idle.onIdleStart.subscribe(() => {
      const timeout = TIMEOUT_TIME_MINUTES - IDLE_TIME_MINUTES;
      let wordTime = 'minutos';
      if (timeout < 2) {
        wordTime = 'minuto';
      }
      Swal.fire({
        position: 'center',
        text: `En ${Math.round(timeout)} ${wordTime} se cerrará la sesión por inactividad`,
        icon: 'warning',
        showConfirmButton: false,
        timer: 10000
      }).then();
    });

    // Do something when the user becomes active again
    idle.onIdleEnd.subscribe(() => {
    });

    // Do something when the user has timed out
    idle.onTimeout.subscribe(() => {
      this.logout();
    });
  }

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

  resetIdle() {
    this.idle.stop();
    this.idle.watch();
  }

  // Guardar el token
  saveToken(access_token: string) {
    this._token = access_token;
    try {
      sessionStorage.setItem('token', this._token);
      const user: DecodeJwt = jwtDecode(this._token);
      this.userService.setUser(user);
    } catch (error) {
      console.error('Error al guardar el token', error);
    }
  }

  // Refrescar el token
  refreshToken(): Observable<{ token: string }> {
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };
    return this.http.post<{ token: string }>(this.urlEndpoint, httpOptions);
  }

  // Login
  login(email: string, password: string): Observable<{ token: string }> {
    const body = { username: email, password: password };
    const httpOptions = {
      headers: new HttpHeaders({ 'Content-Type': 'application/json' })
    };

    return this.http.post<{ token: string }>(this.urlEndpoint, body, httpOptions);
  }

  // Verificar si está autenticado
  isAuthenticated(): boolean {
    if (sessionStorage.getItem('token') !== null) {
      this.resetIdle();
    }
    return sessionStorage.getItem('token') !== null;
  }

  // Logout
  logout(): void {
    // Borrar el valor de la variable _token
    this._token = null;

    // Eliminar el token y el usuario del almacenamiento local
    sessionStorage.removeItem('token');
    sessionStorage.removeItem('user');

    // Detener la verificación de inactividad
    this.idle.stop();

    // Redirigir a la página de inicio
    this.router.navigate(['/']).then(() => {
      window.history.pushState(null, '', window.location.href);
      window.onpopstate = function () {
        window.history.pushState(null, '', window.location.href);
      };
    });

    this.userService.clearUser();
  }

  // Decodificar el token y obtener el 'sub'
  getDecodedToken() {
    const token = sessionStorage.getItem('token');
    if (token) {
      try {
        const decoded = jwtDecode(token);
        return decoded as DecodeJwt;
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
      return this.http.get<UserDetails>(`${this.userUrl}${username}`).pipe(
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
