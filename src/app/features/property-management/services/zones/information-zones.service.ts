import { HttpParams, HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoEconomicZone } from '@features/property-management/models/geo-economic-zone';
import { ZoneBAUnitFisica } from '@shared/interfaces';
import { environment as envi } from '@environments/environments';



@Injectable({
  providedIn: 'root'
})
export class InformationZonesService {

  basic_url = `${envi.url}:${envi.port}`;

  constructor(
    private http: HttpClient
  ) {}

  getByBauniFisica(baunitId: number): Observable<ZoneBAUnitFisica> {
    const url = `${this.basic_url}/${'baUnitZona'}/${'baunitIdFisicas'}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('baunitId', `${baunitId}`);


    return this.getData(url, paramsR);
  }

  getByBauniEcono(baunitId: number): Observable<GeoEconomicZone> {
    const url = `${this.basic_url}/${'baUnitZona'}/${'baunitIdEcono'}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('baunitId', `${baunitId}`);

    return this.getData(url, paramsR);
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  private getData(url: string, params: any): Observable<any> {
    return this.http.get<any>(url, { params: params  });
  }

}
