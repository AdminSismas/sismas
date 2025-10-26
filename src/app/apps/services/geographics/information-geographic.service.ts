import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { catchError, Observable, throwError } from 'rxjs';
import { QueryParametersGeographicVie } from '@shared/interfaces';
import { ChangeControl } from '@shared/interfaces';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InformationGeographicService {
  basic_url = `${envi.url}:${envi.port}${envi.accessGeo.value}`;

  constructor(private http: HttpClient) {}

  getInfoGeographicViewer(
    cadastralNumber: string
  ): Observable<QueryParametersGeographicVie> {
    const url = `${this.basic_url}${envi.accessGeo.extentByCodigoData}/${cadastralNumber}`;
    return this.http.get<QueryParametersGeographicVie>(url).pipe(
      catchError(() => {
        return throwError(
          () => new Error('No se pudo encontrar el mapa solicitado.')
        );
      })
    );
  }

  getViewGeneralMapById(ccZonaId: string): Observable<string | null> {
    const url = `${this.basic_url}${envi.accessGeo.extentByCodigo}${envi.accessGeo.generalMap}${envi.accessGeo.get}${ccZonaId}`;
    return this.http.get<string>(url, { responseType: 'text' as 'json' });
  }

  getViewDataOpenMapByNpn(npn: string): Observable<string | null> {
    const url = `${this.basic_url}${envi.accessGeo.extentByCodigo}${envi.accessGeo.dataOpen}${npn}`;
    return this.http.get<string>(url, { responseType: 'text' as 'json' });
  }

  getViewGeneralMapByExecutionId(
    executionId: string,
    schema: string
  ): Observable<string | null> {
    let url = `${this.basic_url}${envi.accessGeo.extentByCodigo}`;
    if (schema === `${envi.schemas.hist}`) {
      url += `${envi.accessGeo.geoHistoria}${envi.accessGeo.get}${executionId}`;
    } else if (schema === `${envi.schemas.temp}`) {
      url += `${envi.accessGeo.geoTemporal}${envi.accessGeo.get}${executionId}`;
    }
    return this.http.get<string>(url, { responseType: 'text' as 'json' });
  }

  getViewThematicMapByCodeMunicipality(
    codeMunicipality: string
  ): Observable<string | null> {
    const url = `${this.basic_url}${envi.accessGeo.extentByCodigo}${envi.accessGeo.thematicMap}${envi.accessGeo.get}${codeMunicipality}`;
    return this.http.get<string>(url, { responseType: 'text' as 'json' });
  }

  /**
   * POST {{url}}:{{port}}/changeLog/temp/{{executionId}}/geo
   * */
  createGeographicChangesTemp(executionId: string): Observable<ChangeControl> {
    const url = `${envi.url}:${envi.port}${envi.changeLog}${envi.schemas.temp}/${executionId}${envi.accessGeo.geo}`;

    return this.http.post<ChangeControl>(url, {});
  }

  /**
   * DELETE {{url}}:{{port}}/changeLog/temp/{{executionId}}/geo
   * */
  deleteGeographicChangesTemp(executionId: string): Observable<void> {
    return this.http.delete<void>(
      `${envi.url}:${envi.port}${envi.changeLog}${envi.schemas.temp}/${executionId}${envi.accessGeo.geo}`
    );
  }
}
