import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError, of } from 'rxjs';
import { GeoEconomicZone, GeoEconomicZoneDetails, Zone, ZoneServices } from '../../interfaces/economic-mod-land/zone-description';
import { environment as envi } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class GeoeconomicZoneService implements ZoneServices {

  public base_url = `${envi.url}:${envi.port}${envi.geoeconomic_zones}`;

  constructor(
    private http: HttpClient
  ) { }

  getZones(divpolLv1: string, divpolLv2: string): Observable<GeoEconomicZone[]> {
    const url = `${this.base_url}${envi.divpol}`;

    let params = new HttpParams();
    params = params.append('divpolLv1', divpolLv1);
    params = params.append('divpolLv2', divpolLv2);

    return this.http.get<GeoEconomicZone[]>(url, { params })
      .pipe(
        catchError((error: any) => {
          throw error;
        })
      );
  }

  createZone(params: Zone): Observable<GeoEconomicZone> {
    const url = `${this.base_url}`;

    return this.http.post<GeoEconomicZone>(url, params)
      .pipe(
        catchError((error: any) => {
          throw error;
        })
      );
  }

  updateZone(params: GeoEconomicZone): Observable<GeoEconomicZone> {
    const id = params.zonaHomoGeoEconomicaId;
    const url = `${this.base_url}/${id}`;

    return this.http.put<GeoEconomicZone>(url, params)
      .pipe(
        catchError((error: any) => {
          throw error;
        })
      );
  }

  deleteZone(version: string, id: string): Observable<void> {
    const url = `${this.base_url}/${id}`;
    const params = new HttpParams()
      .set('version', version);

    return this.http.delete<void>(url, { params })
      .pipe(
        catchError((error: any) => {
          throw error;
        })
      );
  }

  getValues(id: string | number): Observable<GeoEconomicZoneDetails> {
    const url = `${this.base_url}${envi.geoeconomic_values}`;
    const params = new HttpParams()
      .set('zonaHomoGeoEconomicaId', id);
    return this.http.get<GeoEconomicZoneDetails>(url, { params })
      .pipe(
        catchError((error: any) => {
          throw error;
        })
      );
  }
}
