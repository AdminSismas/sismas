/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '@shared/services';
import { catchError, Observable, throwError, EMPTY } from 'rxjs';
import {
  ContentInformationConstruction,
  CreateBasicInformationConstruction
} from '@shared/interfaces';
import { environment as envi } from '../../../../../environments/environments';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import { PageSearchData } from '@shared/interfaces';
import { InformationPegeable } from '@shared/interfaces';
import { CcCalificacionUB } from '@shared/interfaces';
@Injectable({
  providedIn: 'root'
})
export class InformationConstructionsService {
  basic_url = `${envi.url}:${envi.port}`;

  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) {}

  // ${executionId}/${baunitId}
  getDetailBasicInformationPropertyConstructions(
    id: number | undefined
  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url} ${envi.unitBuilt} ${envi.schemas.temp}/${id}`;
    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError((error) => (error.status === 404 ? EMPTY : throwError(() => error))));
  }

  getBasicInformationPropertyConstructions(
    page: PageSearchData,
    schema: string,
    executionId: string | null | undefined = null
  ): Observable<InformationPegeable> {
    let params: HttpParams = new HttpParams();
    params = params.append('page', `${page.page}`);
    params = params.append('size', `${page.size}`);
    params = params.append('sortBy', `unitBuiltLabel`);
    let url = `${this.basic_url}${envi.unitBuilt}/${schema}`;
    if (!executionId || (executionId && schema === `${envi.schemas.main}`)) {
      url += `/${page.searchData}`;
    } else {
      url += `/${executionId}/${page.searchData}`;
    }
    return this.getData(url, params).pipe(
      catchError((error) => (error.status === 404 ? EMPTY : throwError(() => error)))
    );
  }

  createConstruction(
    executionId: string,
    baunitId: string,
    data: ContentInformationConstruction
  ): Observable<any> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}`;
    return this.http.post<any>(url, data);
  }

  updateConstruction(
    executionId: string,
    baunitId: string,
    data: ContentInformationConstruction
  ): Observable<any> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}`;
    return this.http.put<any>(url, data);
  }

  createBasicInformationPropertyConstruction(
    executionId: string,
    baunitId: string,
    createBasicInformationConstruction: CreateBasicInformationConstruction
  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}`;
    return this.requestsService
      .sendRequestsFetchPostBody(url, createBasicInformationConstruction)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Ocurrió un error inesperado.';
          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error && error.error) {
            errorMessage = error.error;
          }
          return throwError(() => new Error(errorMessage));
        })
      );
  }

  updateQualification(
    executionId: string,
    baunitId: string,
    unitBuiltId: number,
    payload: CcCalificacionUB[]
  ): Observable<void> {
    const url = `${this.basic_url}${envi.calificationUB}${envi.unitBuild}/${envi.schemas.temp}/${executionId}/${baunitId}/${unitBuiltId}`;
    return this.requestsService
      .sendRequestsUpdatePutBody(url, payload)
      .pipe(catchError((error) => (error.status === 404 ? EMPTY : throwError(() => error))));
  }

  getQualificationConstructions(
    executionId: string | null,
    baunitId: string,
    unitBuiltId: number,
    schema: string | null | undefined = `${envi.schemas.temp}`
  ): Observable<CcCalificacionUB[]> {
    let url = `${this.basic_url}${envi.calificationUB}${envi.unitBuild}`;

    if (schema === `${envi.schemas.main}` && !executionId) {
      return this.http.get<CcCalificacionUB[]>(url, {
        params: { unitBuiltId }
      });
    }

    url += `/${schema}/${executionId}/${baunitId}/${unitBuiltId}`;
    return this.http.get<CcCalificacionUB[]>(url);
  }

  getDetailBasicInformationPropertyQualificationConstructions(
    unitBuiltId: number | undefined
  ): Observable<CcCalificacionUB[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('unitBuiltId', `${unitBuiltId}`);
    const url = `${this.basic_url}${envi.calificationUB}${envi.unitBuild}`;
    return this.getData(url, params).pipe(
      catchError((error) => (error.status === 404 ? EMPTY : throwError(() => error)))
    );
  }

  getQualificationForTypology(
    selectedType: string
  ): Observable<CcCalificacionUB[]> {
    const url = `${this.basic_url}${envi.calificationUB}${envi.unitBuild}/${envi.schemas.temp}${envi.typologyType}${selectedType}`;
    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError((error) => (error.status === 404 ? EMPTY : throwError(() => error))));
  }

  deleteConstruction(
    baunitId: string,
    changeLogId: string,
    unitBuiltId: number
  ): Observable<any> {
    const url = `${this.basic_url}${envi.unitBuilt}`;
    const formData = new FormData();
    formData.append('baunitId', baunitId.toString());
    formData.append('changeLogId', changeLogId.toString());
    formData.append('unitBuiltId', unitBuiltId.toString());
    formData.append('word', 'borrar');
    return this.requestsService.sendDeleteParams(url, { body: formData });
  }

  //{{url}}:{{port}}/unitBuilt/temp/{{executionId}}/{{baunitId}}/{{unitBuiltId}}/copy
  copyConstruction(
    baunitId: string,
    executionId: string,
    unitBuiltId: number
  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}/${unitBuiltId}${envi.copy}`;
    return this.http.put<any>(url, null);
  }

  private getData(url: string, params: any): Observable<any> {
    return this.http.get<any>(url, { params: params  });
  }

  getConstructionsWithoutBaunit(
    executionId: string,
    baunitId: string
  ): Observable<ContentInformationConstruction[]> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}${envi.withoutbaunit}`;

    return this.http.get<ContentInformationConstruction[]>(url);
  }

  addConstructionsWithoutBaunit(
    executionId: string,
    unitBuildId: string,
    baunitId: string,
    body: ContentInformationConstruction
  ): Observable<any> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${unitBuildId}/${baunitId}`;

    return this.http.put<any>(url, body);
  }

  getIDConstructionsSuggestion(
    executionId: string,
    baunitId: string
  ): Observable<string> {
    // {{url}}:{{port}}/unitBuilt/temp/{{executionId}}/{{baunitId}}/nextLabel
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}/nextLabel`;

    return this.http.get<string>(url, { responseType: 'text' as 'json' });
  }
}
