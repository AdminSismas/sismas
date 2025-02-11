import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { environment as envi } from '../../../../environments/environments';
import { catchError, Observable, throwError } from 'rxjs';
import { QueryParametersGeographicVie } from '../../interfaces/geographic/query-parameters-geographic-vie';

@Injectable({
  providedIn: 'root'
})
export class InformationGeographicService {

  basic_url = `${envi.url}:${envi.port}${envi.accessGeo.value}`;

  constructor(private requestsService: SendGeneralRequestsService) {
  }

  getArea(cadastralNumber: string, schema: string): Observable<number> {
    const url = `${this.basic_url}${envi.accessGeo.area}/${cadastralNumber}`;
    return this.requestsService.sendRequestsFetchGet(url)
      .pipe(
        catchError(error => this.requestsService.errorNotFound(error)));
  }

  getGeographicViewer(cadastralNumber: string, schema: string): Observable<string> {
    const url = `${this.basic_url}${envi.accessGeo.extentByCodigo}/${cadastralNumber}`;
    return this.requestsService.sendRequestsFetchGet(url)
      .pipe(
        catchError(error => this.requestsService.errorNotFound(error)));
  }

  getInfoGeographicViewer(cadastralNumber: string, schema: string): Observable<QueryParametersGeographicVie> {
    const url = `${this.basic_url}${envi.accessGeo.extentByCodigoData}/${cadastralNumber}`;
    return this.requestsService.sendRequestsFetchGet(url).pipe(
      catchError(error => {

        console.error('Error en la solicitud:', error);

        return throwError(() => new Error('No se pudo encontrar el mapa solicitado.'));
      })
    );
  }
}
