import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { catchError, Observable, throwError } from 'rxjs';
import { HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { InfoPerson } from '../../interfaces/information-property/info-person';

@Injectable({
  providedIn: 'root'
})
export class InformationPersonService {

  basic_url = `${envi.url}:${envi.port}`;

  constructor(private requestsService: SendGeneralRequestsService) { }

  getFindPersonByNumber(number: string, individualTypeNumber:string): Observable<InfoPerson> {
    const url = `${this.basic_url}${envi.individual_findByNumber}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('number', `${number}`);
    paramsR = paramsR.append('individualTypeNumber', `${individualTypeNumber}`);
    return this.getData(url, paramsR);
  }

  getFindParticipantPersonByNumber(number: string, individualTypeNumber:string): Observable<InfoPerson> {
    const url = `${this.basic_url}${envi.individual_findByNumber}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('number', `${number}`);
    paramsR = paramsR.append('individualTypeNumber', `${individualTypeNumber}`);
    return this.getData(url, paramsR)
      .pipe(catchError(error => this.errorNotFoundPerson(error)));
  }

  private getData(url: string, params: any): Observable<any> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }


  errorNotFoundPerson(error: HttpErrorResponse) {
    if (error.status == HttpStatusCode.NotFound) {
      return new Observable<any>((subscriber) => {
        subscriber.next(null);
        subscriber.complete();
      });
    }
    return throwError(() => error);
  }
}
