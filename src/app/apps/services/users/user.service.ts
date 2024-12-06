import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of } from 'rxjs';
import { environment as envi } from 'src/environments/environments';
import { User } from '../../interfaces/users/user';

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
}
