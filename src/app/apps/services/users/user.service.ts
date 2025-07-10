import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, map, Observable, of } from 'rxjs';
import { environment as envi } from 'src/environments/environments';
import {
  User,
  CreateOutput,
  CreateUserParams,
  InformationPageableUser
} from '../../interfaces/users/user';
import { InformationPegeable } from '../../interfaces/general/information-pegeable.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private base_url = `${envi.url}:${envi.port}${envi.bpmUser.value}`;

  constructor(private http: HttpClient) {}

  getUsers(
    page = 0,
    size = 10,
    sortBy = 'username'
  ): Observable<InformationPageableUser> {
    const url = `${this.base_url}`;
    const params: HttpParams = new HttpParams()
      .set('page', page.toString())
      .set('size', size.toString())
      .set('sortBy', sortBy);

    return this.http.get<InformationPageableUser>(url, { params }).pipe(
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  existUserName(username: string): Observable<boolean> {
    const url = `${this.base_url}${envi.bpm_username_exists}${username}`;

    return this.http.get<boolean>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(false);
        }
        throw error;
      })
    );
  }

  existEmail(email: string): Observable<boolean> {
    const url = `${this.base_url}${envi.bpm_email_exists}${email}`;

    return this.http.get<boolean>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(false);
        }
        throw error;
      })
    );
  }

  existIndividual(individualId: number): Observable<boolean> {
    const url = `${this.base_url}${envi.bpm_individual_exists}${individualId}`;

    return this.http.get<boolean>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return of(false);
        }
        throw error;
      })
    );
  }

  createUser(params: CreateUserParams): Observable<CreateOutput> {
    const url = `${this.base_url}`;

    return this.http.post<CreateOutput>(url, params);
  }

  updateUser(userId: number, email: string): Observable<User> {
    const url = `${this.base_url}/${userId}`;

    const params: HttpParams = new HttpParams().set('email', email);

    return this.http.put<User>(url, params).pipe(
      catchError((error: HttpErrorResponse) => {
        throw error;
      })
    );
  }

  searchUser(value: string, pageConfig: { page: number; size: number }): Observable<InformationPegeable> {
    const url = `${this.base_url}${envi.bpmUser.text}/${value}`;
    const params: HttpParams = new HttpParams()
      .set('page', pageConfig.page.toString())
      .set('size', pageConfig.size.toString());

    return this.http.get<InformationPegeable>(url, { params }).pipe(
      map((response) => {
        response.content = response.content.map(
          (user: User) => {
            return {
              ...user,
              fullName: user.individual.fullName
            };
          }
        );
        return response;
      })
    );
  }
}
