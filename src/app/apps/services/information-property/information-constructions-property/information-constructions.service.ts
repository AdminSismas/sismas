import { Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import {
  ContentInformationConstruction, CreateBasicInformationConstruction
} from '../../../interfaces/information-property/content-information-construction';
import { environment as envi } from '../../../../../environments/environments';
import { HttpErrorResponse, HttpParams } from '@angular/common/http';
import { PageSearchData } from '../../../interfaces/general/page-search-data.model';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import { CcCalificacionUB } from '../../../interfaces/information-property/cc-calificacion-ub';
import { SendGeneralRequestsService } from '../../general/send-general-requests.service';

@Injectable({
  providedIn: 'root'
})
export class InformationConstructionsService {

  basic_url = `${envi.url}:${envi.port}`;

  constructor(
    private requestsService: SendGeneralRequestsService
  ) {
  }

  // ${executionId}/${baunitId}
  getDetailBasicInformationPropertyConstructions(id: number | undefined): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url} ${envi.unitBuilt} ${envi.schemas.temp}/${id}`;
    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
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
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  createConstruction(executionId: string, baunitId: string, data: ContentInformationConstruction): Observable<any> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}`;
    return this.requestsService.sendRequestsFetchPostBody(url, data);
  }

  updateConstruction(executionId: string, baunitId: string, data: ContentInformationConstruction): Observable<any> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}`;
    return this.requestsService.sendRequestsUpdatePutBody(url, data);
  }

  createBasicInformationPropertyConstruction(
    executionId: string,
    baunitId: string,
    createBasicInformationConstruction: CreateBasicInformationConstruction
  ): Observable<ContentInformationConstruction> {

    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}`;
    return this.requestsService.sendRequestsFetchPostBody(url, createBasicInformationConstruction)
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


  updateQualification(executionId: string, baunitId: string, unitBuiltId: number, payload: CcCalificacionUB[]): Observable<void> {
    const url = `${this.basic_url}${envi.calificationUB}${envi.unitBuild}/${envi.schemas.temp}/${executionId}/${baunitId}/${unitBuiltId}`;
    return this.requestsService.sendRequestsUpdatePutBody(url, payload).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  getQualificationConstructions(executionId: string, baunitId: string, unitBuiltId: number): Observable<CcCalificacionUB[]> {
    const url = `${this.basic_url}${envi.calificationUB}${envi.unitBuild}/${envi.schemas.temp}/${executionId}/${baunitId}/${unitBuiltId}`;
    return this.requestsService.sendRequestsFetchGet(url);
  }

  getDetailBasicInformationPropertyQualificationConstructions(unitBuiltId: number | undefined,): Observable<CcCalificacionUB[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('unitBuiltId', `${unitBuiltId}`);
    const url = `${this.basic_url}${envi.calificationUB}${envi.unitBuild}`;
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  getQualificationForTypology(selectedType: string, ): Observable<CcCalificacionUB[]> {
    const url = `${this.basic_url}${envi.calificationUB}${envi.unitBuild}/${envi.schemas.temp}${envi.typologyType}${selectedType}`;
    return this.requestsService.sendRequestsFetchGet(url).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }


  deleteConstruction(baunitId: string, changeLogId: string, unitBuiltId: number): Observable<any> {
    const url = `${this.basic_url}${envi.unitBuilt}`;
    const formData = new FormData();
    formData.append('baunitId', baunitId.toString());
    formData.append('changeLogId', changeLogId.toString());
    formData.append('unitBuiltId', unitBuiltId.toString());
    formData.append('word', 'borrar');
    return this.requestsService.sendDeleteParams(url, { body: formData });
  }

  //{{url}}:{{port}}/unitBuilt/temp/{{executionId}}/{{baunitId}}/{{unitBuiltId}}/copy
  copyConstruction(baunitId: string, executionId: string, unitBuiltId: number): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}/${unitBuiltId}${envi.copy}`;
    return this.requestsService.sendRequestsUpdatePutBody(url, null
    );
  }

  private getData(url: string, params: any): Observable<any> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }
}
