import { Injectable } from '@angular/core';
import { HttpErrorResponse, HttpParams, HttpStatusCode } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { catchError, Observable, throwError } from 'rxjs';
import { InformationPegeable } from '../../interfaces/general/information-pegeable.model';
import { InfoPerson } from '../../interfaces/information-property/info-person';
import { People } from '../../interfaces/users/people.model';
import { InfoContact } from '../../interfaces/information-property/info-contact';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private url_basic = `${environment.url}:${environment.port}`;

  constructor(
    private requestsService: SendGeneralRequestsService
  ) {
  }

  getAllPeople(params?: any) {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', params.page);
    paramsR = paramsR.append('size', params.size);
    paramsR = paramsR.append('sortBy', params.sortBy);
    const urlP = `${this.url_basic}${environment.individualNumber}`;
    return this.getData(urlP, paramsR);
  }

  getPeopleTypeNumber(params: any): Observable<InfoPerson> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('number', params.number);
    paramsR = paramsR.append(
      'individualTypeNumber',
      params.individualTypeNumber
    );
    return this.getData(
      `${this.url_basic}${environment.individualTypeNumber}`,
      paramsR);
  }

  getPeopleNumber(params: any) {
    const urlP = `${this.url_basic}${environment.individualNumber}/${params.number}`;
    return this.getDataFetch(urlP);
  }

  userEdit(id: string, body: any): Observable<InfoPerson> {
    return this.requestsService.sendRequestsUpdatePutBody(
      `${environment.url}:${environment.port}${environment.individualNumber}/${id}?baunitId=TESTS`,
      body
    );
  }

  createPeople(body: any) {
    return this.fetchBody(
      `${environment.url}:${environment.port}${environment.individualNumber}`, body
    );
  }

  getDeletePeopleId(params: number) {
    const urlP: string = `${this.url_basic}${environment.individualNumber}/${params}?version=99999`;
    return this.deleteBody(urlP);
  }

  getContactByIndividualId(individualId: number): Observable<InfoContact> {
    return this.requestsService.sendRequestsFetchGet(
      `${this.url_basic}${environment.contact}/${individualId}`
    ).pipe(
      catchError(error => this.errorNotFoundContact(error))
    );
  }

  updateContact(individualId: number, obj: InfoContact): Observable<InfoContact> {
    return this.requestsService.sendRequestsUpdatePutBody(
      `${this.url_basic}${environment.contact}/${individualId}`, obj)
      .pipe(catchError(error => this.requestsService.errorNotFound(error))
      );
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
}
