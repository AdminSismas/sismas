import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../../environments/environments';
import { SendGeneralRequestsService } from '../../general/send-general-requests.service';
import { catchError, distinctUntilChanged, Observable, throwError } from 'rxjs';
import { PageSearchData } from '../../../interfaces/general/page-search-data.model';
import { HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsProcessService {

  basic_url: string = `${envi.url}:${envi.port}${envi.bpmParticipation.value}`;

  constructor(
    private requestsService: SendGeneralRequestsService
  ) {
  }

  getParticipantsProcess(page: PageSearchData, executionId: string): Observable<InformationPegeable> {
    let paramsA: HttpParams = new HttpParams();
    paramsA = paramsA.append('page', `${page.page}`);
    paramsA = paramsA.append('size', `${page.size}`);
    const url: string = `${this.basic_url}${envi.bpmParticipation.participation}${executionId}`;
    return this.getData(url, paramsA);
  }

  getParticipantsCitedProcess(page: PageSearchData, executionId: string): Observable<InformationPegeable> {
    let paramsA: HttpParams = new HttpParams();
    paramsA = paramsA.append('page', `${page.page}`);
    paramsA = paramsA.append('size', `${page.size}`);
    const url: string = `${this.basic_url}${envi.bpmParticipation.participation}${executionId}${envi.typeNotification.cited}`;
    return this.getData(url, paramsA);
  }

  getParticipantsNotifiedProcess(page: PageSearchData, executionId: string): Observable<InformationPegeable> {
    let paramsA: HttpParams = new HttpParams();
    paramsA = paramsA.append('page', `${page.page}`);
    paramsA = paramsA.append('size', `${page.size}`);
    const url: string = `${this.basic_url}${envi.bpmParticipation.participation}${executionId}${envi.typeNotification.notified}`;
    return this.getData(url, paramsA);
  }

  getParticipantsNotifyProcess(page: PageSearchData, executionId: string): Observable<InformationPegeable> {
    let paramsA: HttpParams = new HttpParams();
    paramsA = paramsA.append('page', `${page.page}`);
    paramsA = paramsA.append('size', `${page.size}`);
    const url: string = `${this.basic_url}${envi.bpmParticipation.participation}${executionId}${envi.typeNotification.notify}`;
    return this.getData(url, paramsA);
  }

  private getData(url: string, params: any): Observable<InformationPegeable> {
    return this.requestsService.sendRequestsGetOption(url, { params: params })
      .pipe(
        catchError(error => this.errorNotFoundParticipants(error)),
        distinctUntilChanged()
      );
  }

  errorNotFoundParticipants(error: HttpErrorResponse) {
    if (error.status == HttpStatusCode.NotFound) {
      return new Observable<any>((subscriber) => {
        subscriber.next(new InformationPegeable());
        subscriber.complete();
      });
    }
    return throwError(() => error);
  }
}
