import { Injectable } from '@angular/core';
import { environment as envi } from '@environments/environments';
import { Observable } from 'rxjs';
import { InformationAdjacent } from '@features/property-management/models/information-adjacent';
import { InformationPegeable } from '@shared/models/pageable';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InformationAdjacentPropertyService {
  basic_url = `${envi.url}:${envi.port}`;

  constructor(private http: HttpClient) {}

  getBasicInformationPropertyAdjacent(
    baUnitId: string
  ): Observable<InformationAdjacent[]> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.baunit}/${baUnitId}`;
    return this.http
      .get<InformationAdjacent[]>(url);
  }

  getInformationPropertyTemporalAdjacent(
    page: number,
    size: number,
    baUnitId: string
  ): Observable<InformationPegeable> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.baunit}${envi.page}${baUnitId}`;
    const params: HttpParams = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`);
    return this.http.get<InformationPegeable>(url, { params });
  }

  //POST: {{url}}:{{port}}/ccColindante/temp/{{executionId}}/{{baUnitId}}
  createInformationPropertyAdjacent(
    executionId: string,
    baUnitId: string,
    data: InformationAdjacent
  ): Observable<InformationAdjacent> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.schemas.temp}/${executionId}/${baUnitId}`;
    return this.http
      .post<InformationAdjacent>(url, data);
  }

  //PUT: {{url}}:{{port}}/ccColindante/temp/{{executionId}}/{{baUnitId}}
  updateInformationPropertyAdjacent(
    executionId: string,
    baUnitId: string,
    data: InformationAdjacent
  ): Observable<InformationAdjacent> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.schemas.temp}/${executionId}/${baUnitId}`;
    return this.http
      .put<InformationAdjacent>(url, data);
  }

  //POST: {{url}}:{{port}}/changeLog/temp/{{executionId}}/geo/colindante/{{baunitId}}
  addInformationGeoPropertyAdjacent(
    executionId: string,
    baUnitId: string
  ): Observable<string> {
    const url = `${this.basic_url}${envi.changeLog}${envi.schemas.temp}/${executionId}${envi.accessGeo.geo}${envi.adjacent}${baUnitId}`;

    return this.http.post<string>(url, {}, { responseType: 'text' as 'json' });
  }

  deleteAdjacent(
    executionId: string,
    schema: string,
    baUnitId: string,
    ccColindanteBaUnitId: number
  ): Observable<void> {
    return this.http.delete<void>(
      `${this.basic_url}${envi.ccColindante}${schema}/${executionId}/${baUnitId}/${ccColindanteBaUnitId}`
    );
  }

  masiveDeleteAdjacent(
    executionId: string,
    baunitId: string,
    body: number[]
  ): Observable<null> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.schemas.temp}/${executionId}/${baunitId}`;

    return this.http.delete<null>(url, { body });
  }
}
