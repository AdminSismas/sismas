import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { environment as envi } from '../../../../environments/environments';
import { catchError, Observable, throwError } from 'rxjs';
import { QueryParametersGeographicVie } from '../../interfaces/geographics/query-parameters-geographic-vie';
import { ChangeControl } from '../../interfaces/bpm/change-control';

@Injectable({
  providedIn: 'root'
})
export class InformationGeographicService {

  basic_url = `${envi.url}:${envi.port}${envi.accessGeo.value}`;

  constructor(private requestsService: SendGeneralRequestsService) {
  }


  getInfoGeographicViewer(cadastralNumber: string, schema: string): Observable<QueryParametersGeographicVie> {
    const url = `${this.basic_url}${envi.accessGeo.extentByCodigoData}/${cadastralNumber}`;
    return this.requestsService.sendRequestsFetchGet(url).pipe(
      catchError(error => {
        return throwError(() => new Error('No se pudo encontrar el mapa solicitado.'));
      })
    );
  }

  getViewGeneralMapById(ccZonaId: string): Observable<any> {
    let url = `${this.basic_url}${envi.accessGeo.extentByCodigo}${envi.accessGeo.generalMap}${envi.accessGeo.get}${ccZonaId}`;
    return this.requestsService.sendRequestsGetText(url)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

  getViewDataOpenMapByNpn(npn: string): Observable<any> {
    let url = `${this.basic_url}${envi.accessGeo.extentByCodigo}${envi.accessGeo.dataOpen}${npn}`;
    return this.requestsService.sendRequestsGetText(url)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

  getViewGeneralMapByExecutionId(executionId: string, schema: string): Observable<any> {
    let url = `${this.basic_url}${envi.accessGeo.extentByCodigo}`;
    if (schema === `${envi.schemas.hist}`) {
      url += `${envi.accessGeo.geoHistoria}${envi.accessGeo.get}${executionId}`;
    } else if (schema === `${envi.schemas.temp}`) {
      url += `${envi.accessGeo.geoTemporal}${envi.accessGeo.get}${executionId}`;
    }
    return this.requestsService.sendRequestsGetText(url)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
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
    return this.requestsService.sendDeleteFetch(
      `${envi.url}:${envi.port}${envi.changeLog}${envi.schemas.temp}/${executionId}${envi.accessGeo.geo}`
    );
  }

}
