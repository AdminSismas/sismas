/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpHeaders,
  HttpParams,
  HttpStatusCode
} from '@angular/common/http';
import { environment as envi } from '../../../../environments/environments';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { catchError, Observable, throwError } from 'rxjs';
import { InformationPegeable } from '../../interfaces/general/information-pegeable.model';
import { InfoPerson } from '../../interfaces/information-property/info-person';
import { InfoContact } from '../../interfaces/information-property/info-contact';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private url_basic = `${envi.url}:${envi.port}`;

  constructor(
    private requestsService: SendGeneralRequestsService,
    private http: HttpClient
  ) {}

  getAllPeople(params?: any) {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', params.page);
    paramsR = paramsR.append('size', params.size);
    paramsR = paramsR.append('sortBy', params.sortBy);
    const urlP = `${this.url_basic}${envi.individual.value}`;
    return this.getData(urlP, paramsR);
  }

  getPeopleSearch(
    value: string,
    pageConfig: { page: number; size: number }
  ): Observable<InformationPegeable> {
    const url = `${this.url_basic}${envi.individual.value}${envi.individual.text}/${value}`;
    const params = new HttpParams()
      .set('page', pageConfig.page.toString())
      .set('size', pageConfig.size.toString());

    return this.http.get<InformationPegeable>(url, { params });
  }

  getPeopleTypeNumber(params: any): Observable<InfoPerson> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('number', params.number);
    paramsR = paramsR.append(
      'individualTypeNumber',
      params.individualTypeNumber
    );
    return this.getData(
      `${this.url_basic}${envi.individual.value}${envi.individual.findByNumber}`,
      paramsR
    );
  }

  getPeopleNumber(params: any) {
    const urlP = `${this.url_basic}${envi.individual.value}/${params.number}`;
    return this.getDataFetch(urlP);
  }

  userEdit(id: string, body: any): Observable<InfoPerson> {
    return this.requestsService.sendRequestsUpdatePutBody(
      `${envi.url}:${envi.port}${envi.individual.value}/${id}?baunitId=TESTS`,
      body
    );
  }

  createPeople(body: any) {
    return this.fetchBody(
      `${envi.url}:${envi.port}${envi.individual.value}`,
      body
    );
  }

  getDeletePeopleId(params: number) {
    const urlP = `${this.url_basic}${envi.individual.value}/${params}?version=99999`;
    return this.deleteBody(urlP);
  }

  getContactByIndividualId(individualId: number): Observable<InfoContact> {
    return this.requestsService
      .sendRequestsFetchGet(`${this.url_basic}${envi.contact}/${individualId}`)
      .pipe(catchError((error) => this.errorNotFoundContact(error)));
  }

  updateContact(
    individualId: number,
    obj: InfoContact
  ): Observable<InfoContact> {
    return this.requestsService
      .sendRequestsUpdatePutBody(
        `${this.url_basic}${envi.contact}/${individualId}`,
        obj
      )
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }

  private getData(url: string, params: any): Observable<InfoPerson> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }

  private getDataFetch(url: string): Observable<InformationPegeable> {
    return this.requestsService.sendRequestsFetchGet(url);
  }

  private fetchBody(url: any, body: any): Observable<InformationPegeable> {
    return this.requestsService.sendRequestsFetchPostBody(url, body);
  }

  private updateBody(url: any, body: any): Observable<InformationPegeable> {
    return this.requestsService.sendRequestsUpdatePutBody(url, body);
  }

  private deleteBody(url: any): Observable<InformationPegeable> {
    return this.requestsService.sendDeleteFetch(url);
  }

  errorNotFoundContact(error: HttpErrorResponse) {
    if (error.status == HttpStatusCode.NotFound) {
      return new Observable<any>((subscriber) => {
        subscriber.next(new InfoContact());
        subscriber.complete();
      });
    }
    return throwError(() => error);
  }

  getSequencialCode(): Observable<string> {
    const url = `${this.url_basic}${envi.individual.value}${envi.sequentialCode}`;

    const headers = new HttpHeaders({
      'Content-Type': 'text/plain;charset=UTF-8;'
    });

    return this.http.get(url, { responseType: 'text', headers });
  }
}
