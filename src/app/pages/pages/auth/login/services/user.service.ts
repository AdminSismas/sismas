import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { DecodeJwt, UserDetails } from 'src/app/apps/interfaces/user-details/user.model';
import { jwtDecode } from 'jwt-decode';
import { environment } from 'src/environments/environments';
import { HttpClient } from '@angular/common/http';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<DecodeJwt | null>;
  public currentUser: Observable<DecodeJwt | null>;

  constructor(
    private http: HttpClient
  ) {
    const token = sessionStorage.getItem('token');
    if (token) {
      const savedUser: DecodeJwt = jwtDecode(token);
      this.currentUserSubject = new BehaviorSubject<DecodeJwt | null>(
        savedUser
      );
    } else {
      this.currentUserSubject = new BehaviorSubject<DecodeJwt | null>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();
  }

  setUser(user: DecodeJwt): void {
    this.currentUserSubject.next(user);
  }

  clearUser(): void {
    sessionStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }

  changeRole(newRole: string): void {
    const currentUser = this.currentUserSubject.value;
    if (currentUser) {
      currentUser.role = newRole;
      this.setUser(currentUser);
    }
  }

  getUser(): DecodeJwt | null {
    if (sessionStorage?.getItem('token')) {
      let user: DecodeJwt | null = null;
      this.currentUser.subscribe({
        next: (res) => {
          user = res;
        }
      });

      return user;
    }
    return null;
  }

  getUserInfo(username: string): Observable<UserDetails> {
    const url: string = `${environment.url}:${environment.port}${environment.bpm_user_info}${username}`;

    return this.http.get<UserDetails>(url);
  }
}
