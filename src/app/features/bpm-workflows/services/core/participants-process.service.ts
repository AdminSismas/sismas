import { inject, Injectable } from '@angular/core';
import { environment as envi } from '@environments/environments';
import {
  Observable,
  throwError} from 'rxjs';
import { PageSearchData } from '@shared/models/pageable';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpStatusCode
} from '@angular/common/http';
import { InformationPegeable } from '@shared/models/pageable';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsProcessService {
  basic_url = `${envi.url}:${envi.port}${envi.bpmParticipation.value}`;

  /* ---- Injects ---- */
  http = inject(HttpClient);

  validateParticipants(
    executionId: string,
    page: PageSearchData
  ): Observable<string> {
    const url = `${this.basic_url}${envi.bpmParticipation.participation}${envi.validateParticipation}/${executionId}`;

    return this.http.put<string>(url, {
      params: {
        page: `${page.page}`,
        size: `${page.size}`
      },
      headers: { responseType: 'text' }
    });
  }

  getParticipantsProcess(
    page: PageSearchData,
    executionId: string
  ): Observable<InformationPegeable> {
    const paramsA: HttpParams = new HttpParams()
      .set('page', `${page.page}`)
      .set('size', `${page.size}`);

    const url = `${this.basic_url}${envi.bpmParticipation.participation}${executionId}`;
    return this.getData(url, paramsA);
  }

  getParticipantsCitedProcess(
    page: PageSearchData,
    executionId: string
  ): Observable<InformationPegeable> {
    let paramsA: HttpParams = new HttpParams();
    paramsA = paramsA.append('page', `${page.page}`);
    paramsA = paramsA.append('size', `${page.size}`);
    const url = `${this.basic_url}${envi.bpmParticipation.participation}${executionId}${envi.typeNotification.cited}`;
    return this.getData(url, paramsA);
  }

  getParticipantsNotifiedProcess(
    page: PageSearchData,
    executionId: string
  ): Observable<InformationPegeable> {
    let paramsA: HttpParams = new HttpParams();
    paramsA = paramsA.append('page', `${page.page}`);
    paramsA = paramsA.append('size', `${page.size}`);
    const url = `${this.basic_url}${envi.bpmParticipation.participation}${executionId}${envi.typeNotification.notified}`;
    return this.getData(url, paramsA);
  }

  getParticipantsNotifyProcess(
    page: PageSearchData,
    executionId: string
  ): Observable<InformationPegeable> {
    let paramsA: HttpParams = new HttpParams();
    paramsA = paramsA.append('page', `${page.page}`);
    paramsA = paramsA.append('size', `${page.size}`);
    const url = `${this.basic_url}${envi.bpmParticipation.participation}${executionId}${envi.typeNotification.notify}`;
    return this.getData(url, paramsA);
  }

  getParticipantsWarningProcess(
    executionId: string,
    page: PageSearchData
  ): Observable<InformationPegeable> {
    const url = `${this.basic_url}${envi.bpmParticipation.participation}${executionId}${envi.bpmParticipation.aviso}`;

    const params = new HttpParams()
      .append('page', `${page.page}`)
      .append('size', `${page.size}`);

    return this.http.get<InformationPegeable>(url, { params });
  }

  private getData(
    url: string,
    params: HttpParams
  ): Observable<InformationPegeable> {
    return this.http.get<InformationPegeable>(url, { params });
  }

  errorNotFoundParticipants(error: HttpErrorResponse) {
    if (error.status == HttpStatusCode.NotFound) {
      return new Observable<InformationPegeable>((subscriber) => {
        subscriber.next(new InformationPegeable());
        subscriber.complete();
      });
    }
    return throwError(() => error);
  }
}
