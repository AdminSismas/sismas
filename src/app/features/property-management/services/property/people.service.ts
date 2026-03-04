/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpStatusCode
} from '@angular/common/http';
import { environment as envi } from '@environments/environments';
import { Observable, throwError } from 'rxjs';
import { InformationPegeable } from '@shared/models/pageable';
import { InfoPerson } from '@features/property-management/models/owner/info-person';

// import { InfoContact } from '@features/property-management/models/info-contact';
import { People } from '@features/configuration/interfaces/users/people.model';
import { InfoContact } from '@features/property-management/models/owner/info-contact';

@Injectable({
  providedIn: 'root'
})
export class PeopleService {
  private url_basic = `${envi.url}:${envi.port}`;

  constructor(private http: HttpClient) {}

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

  getPersonByDocumentNumber(
    searchParams: Partial<InfoPerson>
  ): Observable<InfoPerson> {
    const url = `${this.url_basic}${envi.individual.value}${envi.individual.findByNumber}`;

    const params: HttpParams = new HttpParams()
      .set('number', searchParams.number ?? '')
      .set('individualTypeNumber', searchParams.domIndividualTypeNumber ?? '');
    return this.http.get<InfoPerson>(url, { params });
  }

  getPersonByIndividualId(individualId: string) {
    const urlP = `${this.url_basic}${envi.individual.value}/${individualId}`;
    return this.getDataFetch<People>(urlP);
  }

  editPerson(id: string, body: any): Observable<People> {
    return this.http.put<any>(
      `${envi.url}:${envi.port}${envi.individual.value}/${id}?baunitId=TESTS`,
      body
    );
  }

  createPeople(body: Partial<InfoPerson>) {
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
    const url = `${this.url_basic}${envi.contact}/${individualId}`;

    return this.http.get<InfoContact>(url);
  }

  private getData(url: string, params: any): Observable<InfoPerson> {
    return this.http.get<any>(url, { params: params });
  }

  private getDataFetch<T>(url: string): Observable<T> {
    return this.http.get<any>(url);
  }

  private fetchBody(url: any, body: any): Observable<People> {
    return this.http.post<any>(url, body);
  }

  private deleteBody(url: any): Observable<InformationPegeable> {
    return this.http.delete<any>(url);
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
