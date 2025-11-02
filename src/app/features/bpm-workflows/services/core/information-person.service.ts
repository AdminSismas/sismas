import { Injectable, inject } from '@angular/core';
import { HttpErrorResponse, HttpParams, HttpStatusCode, HttpClient } from '@angular/common/http';
import { catchError, Observable, throwError, EMPTY } from 'rxjs';

import { environment as envi } from '@environments/environments';
import { InfoPerson } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class InformationPersonService {
  private http = inject(HttpClient);

  basic_url = `${envi.url}:${envi.port}`;

  getFindPersonByNumber(number: string, individualTypeNumber:string): Observable<InfoPerson> {
    const url = `${this.basic_url}${envi.individual.value}${envi.individual.findByNumber}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('number', `${number}`);
    paramsR = paramsR.append('individualTypeNumber', `${individualTypeNumber}`);
    return this.getData(url, paramsR);
  }

  getFindParticipantPersonByNumber(number: string, individualTypeNumber:string): Observable<InfoPerson> {
    const url = `${this.basic_url}${envi.individual.value}${envi.individual.findByNumber}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('number', `${number}`);
    paramsR = paramsR.append('individualTypeNumber', `${individualTypeNumber}`);
    return this.getData(url, paramsR)
      .pipe(catchError(error => this.errorNotFoundPerson(error)));
  }

  private getData(url: string, params: any): Observable<any> {
    return this.http.get<any>(url, { params: params  });
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
