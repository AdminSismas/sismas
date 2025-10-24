import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '@shared/services';
import { environment as envi } from '../../../../environments/environments';
import { catchError, Observable, throwError, EMPTY } from 'rxjs';
import { QueryParametersGeographicVie } from '@shared/interfaces';
import { ChangeControl } from '@shared/interfaces';
import { HttpErrorResponse, HttpStatusCode, HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InformationGeographicService {

  basic_url = `${envi.url}:${envi.port}${envi.accessGeo.value}`;

  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) {}


  getInfoGeographicViewer(cadastralNumber: string): Observable<QueryParametersGeographicVie> {
    const url = `${this.basic_url}${envi.accessGeo.extentByCodigoData}/${cadastralNumber}`;
    return this.http.get<any>(url).pipe(
      catchError(() => {
        return throwError(() => new Error('No se pudo encontrar el mapa solicitado.'));
      })
    );
  }

  getViewGeneralMapById(ccZonaId: string): Observable<string | null> {
    const url = `${this.basic_url}${envi.accessGeo.extentByCodigo}${envi.accessGeo.generalMap}${envi.accessGeo.get}${ccZonaId}`;
    return this.requestsService.sendRequestsGetText(url)
      .pipe(catchError(error => this.errorNotFoundGeographicMap(error)));
  }

  getViewDataOpenMapByNpn(npn: string): Observable<string | null> {
    const url = `${this.basic_url}${envi.accessGeo.extentByCodigo}${envi.accessGeo.dataOpen}${npn}`;
    return this.requestsService.sendRequestsGetText(url)
      .pipe(catchError(error => this.errorNotFoundGeographicMap(error)));
  }

  getViewGeneralMapByExecutionId(executionId: string, schema: string): Observable<string | null> {
    let url = `${this.basic_url}${envi.accessGeo.extentByCodigo}`;
    if (schema === `${envi.schemas.hist}`) {
      url += `${envi.accessGeo.geoHistoria}${envi.accessGeo.get}${executionId}`;
    } else if (schema === `${envi.schemas.temp}`) {
      url += `${envi.accessGeo.geoTemporal}${envi.accessGeo.get}${executionId}`;
    }
    return this.requestsService.sendRequestsGetText(url)
      .pipe(catchError(error => this.errorNotFoundGeographicMap(error)));
  }

  getViewThematicMapByCodeMunicipality(codeMunicipality: string): Observable<string | null> {
    const url = `${this.basic_url}${envi.accessGeo.extentByCodigo}${envi.accessGeo.thematicMap}${envi.accessGeo.get}${codeMunicipality}`;
    return this.requestsService.sendRequestsGetText(url)
      .pipe(catchError(error => this.errorNotFoundGeographicMap(error)));
  }

  /**
   * POST {{url}}:{{port}}/changeLog/temp/{{executionId}}/geo
   * */
  createGeographicChangesTemp(executionId: string): Observable<ChangeControl> {
    return this.requestsService.sendRequestsFetchPost(
      `${envi.url}:${envi.port}${envi.changeLog}${envi.schemas.temp}/${executionId}${envi.accessGeo.geo}`
    );
  }

  /**
   * DELETE {{url}}:{{port}}/changeLog/temp/{{executionId}}/geo
   * */
  deleteGeographicChangesTemp(executionId: string): Observable<void> {
    return this.http.delete<any>(
      `${envi.url}:${envi.port}${envi.changeLog}${envi.schemas.temp}/${executionId}${envi.accessGeo.geo}`
    );
  }

  errorNotFoundGeographicMap(error: HttpErrorResponse) {
    if (error.status == HttpStatusCode.NotFound) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new Observable<any>((subscriber) => subscriber.complete());
    }
    if (error.status == HttpStatusCode.BadRequest) {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      return new Observable<any>((subscriber) => {
        subscriber.next(null);
        subscriber.complete();
      });
    }
    return throwError(() => error);
  }

}
