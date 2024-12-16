import { UserDataIA } from "./authData.model";
import { Injectable } from '@angular/core';
import { env } from "src/environments/enviromentsIA";
import { BehaviorSubject, Observable, of } from 'rxjs';


@Injectable({
  providedIn: 'root'
})

export class AuthServiceIA {

  private readonly api_sql = `${env.url_base}${env.api}${env.api_end}`;

    //mantiene el estado actual del usuario autenticado.
  private currentUserSubject = new BehaviorSubject<UserDataIA | null>(null);

    //Observable que emite el estado actual del usuario autenticado cada vez que currentUserSubject cambia.
  public currentUser$: Observable<UserDataIA | null> = this.currentUserSubject.asObservable();

  getCurrentUser(): UserDataIA | null {
    return this.currentUserSubject.value;
  }
}
