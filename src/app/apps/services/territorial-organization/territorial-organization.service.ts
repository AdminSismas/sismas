/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Department } from '../../interfaces/territorial-organization/department.model';
import { Municipality } from '../../interfaces/territorial-organization/municipality.model';
import { Township } from '../../interfaces/territorial-organization/township.model';
import { Zone } from '../../interfaces/territorial-organization/zone.model';
import { Sector } from '../../interfaces/territorial-organization/sector.model';
import { Commune } from '../../interfaces/territorial-organization/commune.model';
import { Neighborhood } from '../../interfaces/territorial-organization/neighborhood.model';
import { Block } from '../../interfaces/territorial-organization/block.model';
import { Sidewalk } from '../../interfaces/territorial-organization/sidewalk.model';

@Injectable({
  providedIn: 'root'
})
export class TerritorialOrganizationService {
  basic_url = `${environment.url}:${environment.port}`;

  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) {}

  getDataDeparments(): Observable<Department[]> {
    const { value: qbaunit, ccdpto } = environment.qbaunit;
    const url = `${this.basic_url}${qbaunit}${ccdpto}`;
    return this.requestsService.sendRequestsFetchGet(url);
  }

  getDataDepartments(): Observable<Department[]> {
    const { value: qbaunit, ccdpto } = environment.qbaunit;
    const url = `${this.basic_url}${qbaunit}${ccdpto}`;
    return this.requestsService.sendRequestsFetchGet(url);
  }

  getAllDataDepartments(): Observable<Department[]> {
    const { value: qbaunit, divpol, ccdpto } = environment.qbaunit;
    const url = `${this.basic_url}${qbaunit}${divpol}${ccdpto}`;

    return this.http.get<Department[]>(url);
  }

  getDataMunicipalities(
    dpto: string | null | undefined
  ): Observable<Municipality[]> {
    const { value: qbaunit, ccmpio } = environment.qbaunit;
    const paramsMun: HttpParams = new HttpParams().set('dpto', `${dpto}`);

    const url = `${this.basic_url}${qbaunit}${ccmpio}`;

    return this.getData(url, paramsMun);
  }

  getAllDataMunicipalities(dpto: string): Observable<Municipality[]> {
    const { value: qbaunit, divpol, ccmpio } = environment.qbaunit;
    const url = `${this.basic_url}${qbaunit}${divpol}${ccmpio}`;

    const params: HttpParams = new HttpParams().set('dpto', dpto);

    return this.http.get<Municipality[]>(url, { params });
  }

  getDataTownships(
    deptoMpio: string | null | undefined
  ): Observable<Township[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('deptompio', `${deptoMpio}`);

    const { value: qbaunit, cccorr } = environment.qbaunit;
    const url = `${this.basic_url}${qbaunit}${cccorr}`;

    return this.getData(url, paramsMun);
  }

  getDataZones(deptoMpio: string | null | undefined): Observable<Zone[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('deptompio', `${deptoMpio}`);

    const { value: qbaunit, cczona } = environment.qbaunit;
    const url = `${this.basic_url}${qbaunit}${cczona}`;

    return this.getData(url, paramsMun);
  }

  getDataSectors(ccZonaPkey: string | null | undefined): Observable<Sector[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('ccZonaPkey', `${ccZonaPkey}`);

    const { value: qbaunit, ccsector } = environment.qbaunit;
    const url = `${this.basic_url}${qbaunit}${ccsector}`;

    return this.getData(url, paramsMun);
  }

  getDataCommunes(
    sectorPkey: string | null | undefined
  ): Observable<Commune[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('sectorPkey', `${sectorPkey}`);

    const { value: qbaunit, cccomuna } = environment.qbaunit;
    const url = `${this.basic_url}${qbaunit}${cccomuna}`;

    return this.getData(url, paramsMun);
  }

  getDataNeighborhoods(
    communityPkey: string | null | undefined
  ): Observable<Neighborhood[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('comunaPkey', `${communityPkey}`);
    const { value: qbaunit, ccbarrio } = environment.qbaunit;
    const url = `${this.basic_url}${qbaunit}${ccbarrio}`;
    return this.getData(url, paramsMun);
  }

  getDataBlocks(
    neighborhoodPkey: string | null | undefined
  ): Observable<Block[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('barrioPkey', `${neighborhoodPkey}`);

    const { value: qbaunit, ccmanzana } = environment.qbaunit;
    const url = `${this.basic_url}${qbaunit}${ccmanzana}`;

    return this.getData(url, paramsMun);
  }

  getDataSidewalks(
    sectorPkey: string | null | undefined
  ): Observable<Sidewalk[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('sectorPkey', `${sectorPkey}`);

    const { value: qbaunit, ccvereda } = environment.qbaunit;
    const url = `${this.basic_url}${qbaunit}${ccvereda}`;

    return this.getData(url, paramsMun);
  }

  advancedSearch(): Observable<any[]> {
    const params: HttpParams = new HttpParams()
      .set('npnlike', '1800101040000030600069')
      .set('page', '0')
      .set('size', '4');

    const url = `${this.basic_url}/baunit/npnlike`;
    return this.http.get<any[]>(url, { params });
  }

  private getData(url: string, params: any): Observable<any[]> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }
}
