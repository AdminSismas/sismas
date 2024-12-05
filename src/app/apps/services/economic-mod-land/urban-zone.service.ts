import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment as envi } from 'src/environments/environments';
import { UrbanZone, Zone } from '../../interfaces/economic-mod-land/zone-description';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class UrbanZoneService {

  public base_url: string = `${envi.url}:${envi.port}${envi.urban_zones}`

  constructor(
    private http: HttpClient
  ) { }

  getZones(divpolLv1: string, divpolLv2: string): Observable<UrbanZone[]> {
    const url = `${this.base_url}${envi.divpol}`

    let params = new HttpParams()
    params = params.append('divpolLv1', divpolLv1)
    params = params.append('divpolLv2', divpolLv2)

    return this.http.get<UrbanZone[]>(url, { params })
      .pipe(
        catchError((error: any) => {
          console.log('Error consultando zonas urbanas')
          throw error
        })
      )
  }

  createZone(params: Zone): Observable<UrbanZone> {
    const url: string = `${this.base_url}`

    return this.http.post<UrbanZone>(url, params)
      .pipe(
        catchError((error: any) => {
          console.log('Error creando zona física urbana')
          throw error
        })
      )
  }
}
