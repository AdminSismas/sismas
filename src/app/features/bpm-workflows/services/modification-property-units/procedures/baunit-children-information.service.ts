import { Injectable } from '@angular/core';
import { environment as envi } from '@environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { Baunit } from '@shared/interfaces';
import { PageSearchData } from '@shared/interfaces';
import { InformationPegeable } from '@shared/interfaces';
import { SimpleResponse } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class UnitPropertyInformationService {
  basic_url = `${envi.url}:${envi.port}`;

  constructor(private http: HttpClient) {}

  //{{url}}:{{port}}/baunit/baunitId
  getBaunitInformation(baunitId: string): Observable<Baunit> {
    let url = `${this.basic_url}${envi.baunit_baunitId}`;
    url += `?baunitId=${baunitId}`;
    return this.http.get<Baunit>(url);
  }

  //{{url}}:{{port}}/baunit/npnlike
  getListUnitPropertyInformation(
    page: PageSearchData,
    npn: string
  ): Observable<InformationPegeable> {
    const url = `${this.basic_url}${envi.baunit_npnlike}`;
    const npnlike: string = npn.toString().slice(0, 22);
    const paramsR: HttpParams = new HttpParams()
      .set('npnlike', `${npnlike}`)
      .set('page', `${page.page}`)
      .set('size', `${page.size}`);
    return this.http.get<InformationPegeable>(url, { params: paramsR }).pipe(
      map((result) => {
        const new_content = result.content.filter(
          (baUnit: Baunit) => baUnit.cadastralNumber !== npn
        );
        result.content = new_content;
        return result;
      })
    );
  }

  //{{url}}:{{port}}/baunit/headBaunitByMaster/main/{baunitId}
  getListPropertyUnitsByBaUnitId(
    page: PageSearchData,
    executionId: string | null | undefined,
    baunitId: string
  ): Observable<InformationPegeable> {
    let url = '';
    if (!executionId) {
      url = `${this.basic_url}/${envi.baunit}${envi.headBaunitByMaster}/${envi.schemas.main}/${baunitId}`;
    } else {
      url = `${this.basic_url}/${envi.baunit}${envi.headBaunitByMaster}/${envi.schemas.temp}/${executionId}/${baunitId}`;
    }
    const paramsR: HttpParams = new HttpParams()
      .set('page', `${page.page}`)
      .set('size', `${page.size}`);
    return this.http.get<InformationPegeable>(url, { params: paramsR });
  }

  // {{url}}:{{port}}/baunit/headBaunitByMaster/main/v2/{{baunitId}}?page=0&size=10
  // {{url}}:{{port}}/baunit/headBaunitByMaster/temp/v2/{{executionId}}/{{baunitId}}?page=0&size=10
  getListPropertyUnitsByBaUnitIdV2(
    page: PageSearchData,
    executionId: string | null | undefined,
    baunitId: string
  ): Observable<InformationPegeable> {
    let url = '';
    if (!executionId) {
      url = `${this.basic_url}/${envi.baunit}${envi.headBaunitByMaster}/${envi.schemas.main}${envi.v2}/${baunitId}`;
    } else {
      url = `${this.basic_url}/${envi.baunit}${envi.headBaunitByMaster}/${envi.schemas.temp}${envi.v2}/${executionId}/${baunitId}`;
    }
    const paramsR: HttpParams = new HttpParams()
      .set('page', `${page.page}`)
      .set('size', `${page.size}`);
    return this.http.get<InformationPegeable>(url, { params: paramsR });
  }

  createBaUnitCreateDetail(
    baunitIdMaster: string,
    executionId: string,
    domBaunitCondition: string,
    buildNumber: string,
    floorNumber: string
  ): Observable<void> {
    const formData = new FormData();
    formData.append('baunitIdMaster', `${baunitIdMaster}`);
    formData.append('changeLogId', `${executionId}`);
    formData.append('domBaunitCondition', `${domBaunitCondition}`);
    formData.append('buildNumber', `${buildNumber}`);
    formData.append('floorNumber', `${floorNumber}`);
    const url = `${this.basic_url}${envi.temporal}${envi.bAUnitCreateDetail}`;

    return this.http.post<void>(url, formData);
  }

  assignamentZones(
    executionId: string,
    baunitId: string
  ): Observable<SimpleResponse> {
    const url = `${this.basic_url}${envi.baUnitZona}${envi.baunitIdTodas}/${envi.schemas.temp}/${executionId}/${baunitId}${envi.asignacionZonas}`;

    return this.http.put<SimpleResponse>(url, null);
  }
}
