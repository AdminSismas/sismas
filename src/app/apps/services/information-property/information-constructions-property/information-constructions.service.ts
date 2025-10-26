import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import {
  ContentInformationConstruction,
  CreateBasicInformationConstruction
} from '@shared/interfaces';
import { environment as envi } from '../../../../../environments/environments';
import {
  HttpClient,
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

  private http = inject(HttpClient);

  // ${executionId}/${baunitId}
  getDetailBasicInformationPropertyConstructions(
    id: number | undefined
  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url} ${envi.unitBuilt} ${envi.schemas.temp}/${id}`;
    return this.http.get<ContentInformationConstruction>(url);
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
    return this.http.get<InformationPegeable>(url, { params });
  }

  createConstruction(
    executionId: string,
    baunitId: string,
    data: ContentInformationConstruction
  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}`;
    return this.http.post<ContentInformationConstruction>(url, data);
  }

  updateConstruction(
    executionId: string,
    baunitId: string,
    data: ContentInformationConstruction
  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}`;
    return this.http.put<ContentInformationConstruction>(url, data);
  }

  createBasicInformationPropertyConstruction(
    executionId: string,
    baunitId: string,
    createBasicInformationConstruction: CreateBasicInformationConstruction
  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}`;
    return this.http.post<ContentInformationConstruction>(url, createBasicInformationConstruction);
  }

  updateQualification(
    executionId: string,
    baunitId: string,
    unitBuiltId: number,
    payload: CcCalificacionUB[]
  ): Observable<void> {
    const url = `${this.basic_url}${envi.calificationUB}${envi.unitBuild}/${envi.schemas.temp}/${executionId}/${baunitId}/${unitBuiltId}`;
    return this.http.put<void>(url, payload);
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
    return this.http.get<CcCalificacionUB[]>(url, { params });
  }

  getQualificationForTypology(
    selectedType: string
  ): Observable<CcCalificacionUB[]> {
    const url = `${this.basic_url}${envi.calificationUB}${envi.unitBuild}/${envi.schemas.temp}${envi.typologyType}${selectedType}`;
    return this.http.get<CcCalificacionUB[]>(url);
  }

  deleteConstruction(
    baunitId: string,
    changeLogId: string,
    unitBuiltId: number
  ): Observable<void> {
    const url = `${this.basic_url}${envi.unitBuilt}`;
    const formData = new FormData();
    formData.append('baunitId', baunitId.toString());
    formData.append('changeLogId', changeLogId.toString());
    formData.append('unitBuiltId', unitBuiltId.toString());
    formData.append('word', 'borrar');
    return this.http.delete<void>(url, { body: formData });
  }

  //{{url}}:{{port}}/unitBuilt/temp/{{executionId}}/{{baunitId}}/{{unitBuiltId}}/copy
  copyConstruction(
    baunitId: string,
    executionId: string,
    unitBuiltId: number
  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}/${unitBuiltId}${envi.copy}`;
    return this.http.put<ContentInformationConstruction>(url, null);
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
  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${unitBuildId}/${baunitId}`;

    return this.http.put<ContentInformationConstruction>(url, body);
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
