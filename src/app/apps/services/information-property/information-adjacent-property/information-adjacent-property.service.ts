import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../../environments/environments';
import { catchError, Observable , EMPTY, throwError } from 'rxjs';
import { InformationAdjacent } from '@shared/interfaces';
import { InformationPegeable } from '@shared/interfaces';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InformationAdjacentPropertyService {

  basic_url = `${envi.url}:${envi.port}`;

  constructor(
    private http: HttpClient
  ) {}

  getBasicInformationPropertyAdjacent(baUnitId: string): Observable<InformationAdjacent[]> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.baunit}/${baUnitId}`;
    return this.http.get<any>(url)
      .pipe(catchError((error) => (error.status === 404 ? EMPTY : throwError(() => error))));
  }

  getInformationPropertyTemporalAdjacent(
    page: number, size: number,
    baUnitId: string): Observable<InformationPegeable> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.baunit}${envi.page}${baUnitId}`;
    const params: HttpParams = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`);
    return this.getData<InformationPegeable>(url, params).pipe(
      catchError((error) => (error.status === 404 ? EMPTY : throwError(() => error)))
    );
  }

  //POST: {{url}}:{{port}}/ccColindante/temp/{{executionId}}/{{baUnitId}}
  createInformationPropertyAdjacent(executionId: string, baUnitId: string,
                                    data: InformationAdjacent): Observable<InformationAdjacent> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.schemas.temp}/${executionId}/${baUnitId}`;
    return this.http.post<any>(url, data)
      .pipe(catchError((error) => (error.status === 404 ? EMPTY : throwError(() => error))));
  }

  //PUT: {{url}}:{{port}}/ccColindante/temp/{{executionId}}/{{baUnitId}}
  updateInformationPropertyAdjacent(executionId: string, baUnitId: string,
                                    data: InformationAdjacent): Observable<InformationAdjacent> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.schemas.temp}/${executionId}/${baUnitId}`;
    return this.http.put<any>(url, data)
      .pipe(catchError((error) => (error.status === 404 ? EMPTY : throwError(() => error))));
  }

  //POST: {{url}}:{{port}}/changeLog/temp/{{executionId}}/geo/colindante/{{baunitId}}
  addInformationGeoPropertyAdjacent(executionId: string, baUnitId: string): Observable<string> {
    const url = `${this.basic_url}${envi.changeLog}${envi.schemas.temp}/${executionId}${envi.accessGeo.geo}${envi.adjacent}${baUnitId}`;
    return this.requestsService.sendPostText(url).pipe(
      catchError((error) => (error.status === 404 ? EMPTY : throwError(() => error)))
    );
  }

  deleteAdjacent(executionId: string, schema: string, baUnitId: string,
                 ccColindanteBaUnitId: number): Observable<void> {
    return this.http.delete<any>(
      `${this.basic_url}${envi.ccColindante}${schema}/${executionId}/${baUnitId}/${ccColindanteBaUnitId}`
    );
  }

  masiveDeleteAdjacent( executionId: string, baunitId: string, body: number[] ): Observable<null> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.schemas.temp}/${executionId}/${baunitId}`;

    return this.http.delete<null>(url, { body });
  }


  private getData<T>(url: string, params: HttpParams): Observable<T> {
    return this.http.get<any>(url, { params: params  }) as Observable<T>;
  }

}
