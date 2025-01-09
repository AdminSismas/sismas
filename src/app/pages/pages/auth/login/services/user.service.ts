import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { DecodeJwt } from 'src/app/apps/interfaces/user-details/user.model';
import { jwtDecode } from 'jwt-decode';

@Injectable({
  providedIn: 'root'
})
export class UserService {
  private currentUserSubject: BehaviorSubject<DecodeJwt | null>;
  public currentUser: Observable<DecodeJwt | null>;

  constructor() {
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
}
