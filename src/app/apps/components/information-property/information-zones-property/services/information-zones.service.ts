import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoEconomicZoneInfo, PhysicalZoneInfo } from 'src/app/apps/interfaces/information-property/info-zones';
import { ZoneBAUnit } from 'src/app/apps/interfaces/information-property/zone-baunit';
import { SendGeneralRequestsService } from 'src/app/apps/services/general/send-general-requests.service';
import { environment as envi } from 'src/environments/environments';



@Injectable({
  providedIn: 'root'
})
export class InformationZonesService {

  basic_url: string = `${envi.url}:${envi.port}`;

  constructor(private requestsService: SendGeneralRequestsService) { }

  getByBauniFisica(baunitId: number): Observable<ZoneBAUnit> {
    const url: string = `${this.basic_url}/${'baUnitZona'}/${'baunitIdFisicas'}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('baunitId', `${baunitId}`);

    console.log('url', url);

    return this.getData(url, paramsR);
  }

  getByBauniEcono(baunitId: number): Observable<GeoEconomicZoneInfo> {
    const url: string = `${this.basic_url}/${'baUnitZona'}/${'baunitIdEcono'}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('baunitId', `${baunitId}`);

    return this.getData(url, paramsR);
  }

  private getData(url: string, params: any): Observable<any> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }

}
