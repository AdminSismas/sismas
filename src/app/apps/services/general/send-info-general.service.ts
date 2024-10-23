import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { VexConfig, VexConfigName } from '@vex/config/vex-config.interface';
import { ProTaskE } from '../../interfaces/pro-task-e';

@Injectable({
  providedIn: 'root'
})
export class SendInfoGeneralService {

  private _configProTaskE = new BehaviorSubject<ProTaskE>({});
  private _configURLFather = new BehaviorSubject<string>('');
  constructor() { }

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
