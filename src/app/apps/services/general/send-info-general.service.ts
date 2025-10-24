import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '@shared/services';
import { BehaviorSubject, Observable } from 'rxjs';
import { ProTaskE } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class SendInfoGeneralService {

  private _configProTaskE = new BehaviorSubject<ProTaskE>({});
  private _configURLFather = new BehaviorSubject<string>('');

  get infoProTaskE$(): Observable<ProTaskE> {
    return this._configProTaskE.asObservable();
  }

  setInfoProTaskE(protaskE: ProTaskE) {
    this._configProTaskE.next(protaskE);
  }

  get infoFatherURL$(): Observable<string> {
    return this._configURLFather.asObservable();
  }

  setFatherURL(url: string) {
    this._configURLFather.next(url);
  }



}
