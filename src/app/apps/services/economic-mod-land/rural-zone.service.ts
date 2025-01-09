import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { RuralZone, Zone, ZoneServices } from '../../interfaces/economic-mod-land/zone-description';
import { environment as envi } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class RuralZoneService implements ZoneServices{

  public base_url = `${envi.url}:${envi.port}${envi.rural_zones}`;

  constructor(
    private http: HttpClient
  ) { }

  getZones(divpolLv1: string, divpolLv2: string): Observable<RuralZone[]> {
    const url = `${this.base_url}${envi.divpol}`;

    let params = new HttpParams();
    params = params.append('divpolLv1', divpolLv1);
    params = params.append('divpolLv2', divpolLv2);

    return this.http.get<RuralZone[]>(url, { params })
      .pipe(
        catchError((error: any) => {
          console.log('Error consultando zonas urbanas');
          throw error;
        })
      );
  }

  createZone(params: Zone): Observable<RuralZone> {
    const url = `${this.base_url}`;

    return this.http.post<RuralZone>(url, params)
      .pipe(
        catchError((error: any) => {
          console.log('Error creando zona física rural');
          throw error;
        })
      );
  }

  updateZone(params: RuralZone): Observable<RuralZone> {
    const id = params.zonaHomoFisicaRuId;
    const url = `${this.base_url}/${id}`;

    return this.http.put<RuralZone>(url, params)
      .pipe(
        catchError((error: any) => {
          console.log('Error actualizando zona física urbana');
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
          console.log('Error eliminando zona física urbana');
          throw error;
        })
      );
  }
}
