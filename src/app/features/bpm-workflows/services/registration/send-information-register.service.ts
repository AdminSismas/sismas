import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaunitHead } from '@shared/models';

@Injectable({
  providedIn: 'root'
})
export class SendInformationRegisterService {

  private _baunitHead = new BehaviorSubject<any>({});

  constructor(
    private http: HttpClient
  ) {}

  get informationRegister$(): Observable<BaunitHead> {
    return this._baunitHead.asObservable();
  }

  setInformationRegister(data: BaunitHead) {
    this._baunitHead.next(data);
  }

  clearInformationRegister() {
    this._baunitHead.next({});
  }
}
