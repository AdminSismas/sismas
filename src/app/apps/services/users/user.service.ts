import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment as envi } from 'src/environments/environments';
import { CreateUserParams, User } from '../../interfaces/users/user';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private base_url: string = `${envi.url}:${envi.port}${envi.bpm_users}`;

  constructor(
    private http: HttpClient
  ) { }

  getUsers(page: number = 0, size: number = 10, sortBy: string = 'username'): Observable<User> {
    const url: string = `${this.base_url}`;
    const params: HttpParams = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<User>(url, { params })
      .pipe(
        catchError((error: any) => {
          console.log('Error en la obtención de la información de los usuarios')
          throw error;
        })
      )
  }

  existUserName(username: string): Observable<boolean> {
    const url: string = `${this.base_url}${envi.bpm_username_exists}${username}`

    return this.http.get<boolean>(url)
      .pipe(
        catchError((error: any) => {
          if (error.status === 404) {
            return of(false)
          }
          console.log('Error en la verificación del nombre de usuario')
          throw error;
        })
      )

  }

  existEmail(email: string): Observable<boolean> {
    const url: string = `${this.base_url}${envi.bpm_email_exists}${email}`

    return this.http.get<boolean>(url)
      .pipe(
        catchError((error: any) => {
          if (error.status === 404) {
            return of(false)
          }
          console.log('Error en la verificación del correo electrónico')
          throw error;
        })
      )

  }

  createUser(params: CreateUserParams): Observable<string> {
    const url: string = `${this.base_url}`

    return this.http.post<string>(url, params)
  }
}
