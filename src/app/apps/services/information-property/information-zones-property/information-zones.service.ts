import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GeoEconomicZoneInfo, PhysicalZoneInfo } from '../../../interfaces/information-property/info-zones';
import { ZoneBAUnit } from '../../../interfaces/information-property/zone-baunit';
import { SendGeneralRequestsService } from '../../general/send-general-requests.service';
import { environment as envi } from '../../../../../environments/environments';



@Injectable({
  providedIn: 'root'
})
export class InformationZonesService {

  basic_url = `${envi.url}:${envi.port}`;

  constructor(private requestsService: SendGeneralRequestsService) { }

  getByBauniFisica(baunitId: number): Observable<ZoneBAUnit> {
    const url = `${this.basic_url}/${'baUnitZona'}/${'baunitIdFisicas'}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('baunitId', `${baunitId}`);


    return this.getData(url, paramsR);
  }

  getByBauniEcono(baunitId: number): Observable<GeoEconomicZoneInfo> {
    const url = `${this.basic_url}/${'baUnitZona'}/${'baunitIdEcono'}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('baunitId', `${baunitId}`);

    return this.getData(url, paramsR);
  }

  private getData(url: string, params: any): Observable<any> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }

}
