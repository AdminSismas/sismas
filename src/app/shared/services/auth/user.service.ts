import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import {
  DecodeJwt,
  UserDetails,
  UserRole
} from '@shared/models/user.model';
import { jwtDecode } from 'jwt-decode';
import { HttpClient } from '@angular/common/http';
import { environment } from '@environments/environments';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<DecodeJwt | null>;
  public currentUser: Observable<DecodeJwt | null>;
  private currentUserDataSubject: BehaviorSubject<number | null>;
  public currentUserData: Observable<number | null>;
  constructor(
    private http: HttpClient
  ) {
    const token = sessionStorage.getItem('token');
    if (token && token !== 'null') {
      const savedUser: DecodeJwt = jwtDecode(token);
      this.currentUserSubject = new BehaviorSubject<DecodeJwt | null>(
        savedUser
      );
    } else {
      this.currentUserSubject = new BehaviorSubject<DecodeJwt | null>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();

    const ID = sessionStorage.getItem('ID');
    if (ID) {
      const savedUserData: number = JSON.parse(ID);
      this.currentUserDataSubject = new BehaviorSubject<number | null>(
        savedUserData
      );
    } else {
      this.currentUserDataSubject = new BehaviorSubject<number | null>(null);
    }
    this.currentUserData = this.currentUserDataSubject.asObservable();
  }

  setUser(user: DecodeJwt): void {
    this.currentUserSubject.next(user);
  }

  clearUser(): void {
    sessionStorage.removeItem('ID');
    this.currentUserSubject.next(null);
  }

  changeRole(newRole: UserRole): void {
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
  getUserData(): number | null {
    return this.currentUserDataSubject.value;
  }

  getUserInfo(username: string): Observable<UserDetails> {
    const url = `${environment.url}:${environment.port}${environment.bpmUser.value}${environment.bpmUser.username}/${username}`;

    return this.http.get<UserDetails>(url);
  }

  setUserData(user: UserDetails): void {
    sessionStorage.setItem('ID', JSON.stringify(user.userId));
    this.currentUserDataSubject.next(user.userId);
  }
}
