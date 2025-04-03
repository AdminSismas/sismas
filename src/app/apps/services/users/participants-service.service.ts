import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, Subject, throwError } from 'rxjs';
import { PageSearchData } from '../../interfaces/general/page-search-data.model';
import { InformationPegeable } from '../../interfaces/general/information-pegeable.model';
import { ProcessParticipant } from '../../interfaces/bpm/process-participant';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsServiceService {
  private url_basic = `${envi.url}:${envi.port}`;

  private chargeInfoSubject = new BehaviorSubject<boolean | null>(false);
  chargeInfoSubject$ = this.chargeInfoSubject.asObservable();

  constructor(
    private requestsService: SendGeneralRequestsService
  ) {
  }

  changeInfoParticipants(value:boolean | null){
    this.chargeInfoSubject.next(value);
  }

  getAllParticipants(page: PageSearchData, executionId: string): Observable<InformationPegeable> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', `${page.page}`);
    paramsR = paramsR.append('size', `${page.size}`);
    return this.getData(
      `${this.url_basic}${envi.bpmParticipation.value}${envi.bpmParticipation.participation}/${executionId}`,
      paramsR
    );
  }

  getExistThirdPartyAffected(executionId: string): Observable<boolean> {
    return this.getAllThirdPartyAffected(executionId)
      .pipe(map((result: ProcessParticipant[]) => result != null && result.length > 0));
  }

  getAllThirdPartyAffected(executionId: string): Observable<ProcessParticipant[]> {
    return this.requestsService.sendRequestsFetchGet(
      `${this.url_basic}${envi.bpmParticipation.value}${envi.bpmParticipation.thirdPartyAffected}/${executionId}`
    ).pipe(catchError(error => this.errorNotFoundList(error)));
  }

  saveParticipantByExecutionId(executionId: string, body: ProcessParticipant): Observable<ProcessParticipant> {
    return this.requestsService.sendRequestsFetchPostBody(
      `${this.url_basic}${envi.bpmParticipation.value}${envi.bpmParticipation.participation}/${executionId}`,
      body
    );
  }

  updateParticipantByExecutionId(executionId: string, body: ProcessParticipant): Observable<ProcessParticipant> {
    return this.requestsService.sendRequestsUpdatePutBody(
      `${this.url_basic}${envi.bpmParticipation.value}${envi.bpmParticipation.participation}/${executionId}`,
      body
    );
  }

  deleteParticipantByExecutionId(executionId: string, participationId: string): Observable<void> {
    return this.requestsService.sendDeleteFetch(
      `${this.url_basic}${envi.bpmParticipation.value}${envi.bpmParticipation.participation}/${executionId}/${participationId}`
    );
  }

  private getData(url: string, params: any): Observable<any> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }

  errorNotFoundList(error: HttpErrorResponse) {
    if (error.status == HttpStatusCode.NotFound) {
      return new Observable<any>((subscriber) => {
        subscriber.next([]);
        subscriber.complete();
      });
    }
    return throwError(() => error);
  }
}
