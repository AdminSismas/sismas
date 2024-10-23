import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { BaunitHead } from '../../interfaces/information-property/baunit-head.model';

@Injectable({
  providedIn: 'root'
})
export class SendInformationRegisterService {

  private _baunitHead = new BehaviorSubject<any>({});

  constructor() {
  }

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
