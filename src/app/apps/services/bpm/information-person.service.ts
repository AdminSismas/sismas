import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { InfoPerson } from '../../interfaces/information-property/info-person';

@Injectable({
  providedIn: 'root'
})
export class InformationPersonService {

  basic_url: string = `${envi.url}:${envi.port}`;

  constructor(private requestsService: SendGeneralRequestsService) { }

  getFindPersonByNumber(number: string, individualTypeNumber:string): Observable<InfoPerson> {
    const url: string = `${this.basic_url}${envi.individual_findByNumber}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('number', `${number}`);
    paramsR = paramsR.append('individualTypeNumber', `${individualTypeNumber}`);
    return this.getData(url, paramsR);
  }

  private getData(url: string, params: any): Observable<any> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }
}
