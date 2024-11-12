import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { environment } from 'src/environments/environments';
import { SendGeneralRequestsService } from './general/send-general-requests.service';
import { Observable } from 'rxjs';
import { InformationPegeable } from '../interfaces/information-pegeable.model';
@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private url_basic = `${environment.url}:${environment.port}`;

  constructor(
    private requestsService: SendGeneralRequestsService
  ) {}

  getAllPeople(params?: any) {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', params.page);
    paramsR = paramsR.append('size', params.size);
    paramsR = paramsR.append('sortBy', params.sortBy);
    const urlP: string = `${this.url_basic}${environment.individualNumber}`;
    return this.getData(urlP, paramsR);
  }

  getPeopleTypeNumber(params: any) {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('number', params.number);
    paramsR = paramsR.append(
      'individualTypeNumber',
      params.individualTypeNumber
    );

    const urlP: string = `${this.url_basic}${environment.individualTypeNumber}`;
    return this.getData(urlP, paramsR);
  }

  getPeopleNumber(params: any) {
    const urlP: string = `${this.url_basic}${environment.individualNumber}/${params.number}`;
    return this.getDataFetch(urlP);
  }

  // editamos el usuario
  userEdit(params: any) {
    const body = params.body;
    const url = params.url;
    return this.updateBody(url, body);
  }

  // creamos el usuario
  userCreate(params: any) {
    const body = params.body;
    const url = params.url;
    return this.fetchBody(url, body);
  }

  private getData(url: string, params: any): Observable<InformationPegeable> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }

  private getDataFetch(url: string): Observable<InformationPegeable> {
    return this.requestsService.sendRequestsFetchGet(url);
  }

  private fetchBody(url: any, body: any): Observable<InformationPegeable> {
    return this.requestsService.sendRequestsFetchPostBody(url, body);
  }
  private updateBody(url: any, body: any): Observable<InformationPegeable> {
    return this.requestsService.sendRequestsUpdatePostBody(url, body);
  }
}
