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

    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
        this.currentUserSubject = new BehaviorSubject<DecodeJwt | null>(JSON.parse(savedUser));
    } else {
        this.currentUserSubject = new BehaviorSubject<DecodeJwt | null>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();
}


  setUser(user: DecodeJwt): void {
    // sessionStorage.setItem('user', JSON.stringify(user));
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
      const decodedToken = jwtDecode<DecodeJwt>(sessionStorage.getItem('token') as string);
      console.log(decodedToken);
      return decodedToken;
    }
    return null;
  }
}
