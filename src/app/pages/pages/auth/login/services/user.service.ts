import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UserDetails } from 'src/app/apps/interfaces/user-details/user.model';


@Injectable({
  providedIn: 'root'
})
export class UserService {

  private currentUserSubject: BehaviorSubject<UserDetails | null>;
  public currentUser: Observable<UserDetails | null>;

constructor() {

    const savedUser = sessionStorage.getItem('user');
    if (savedUser) {
        this.currentUserSubject = new BehaviorSubject<UserDetails | null>(JSON.parse(savedUser));
    } else {
        this.currentUserSubject = new BehaviorSubject<UserDetails | null>(null);
    }
    this.currentUser = this.currentUserSubject.asObservable();
}


  setUser(user: UserDetails): void {
    sessionStorage.setItem('user', JSON.stringify(user));  
    this.currentUserSubject.next(user);
  }


  clearUser(): void {
    sessionStorage.removeItem('user');
    this.currentUserSubject.next(null);
  }


  getUser(): UserDetails | null {
    return this.currentUserSubject.value;
  }
}