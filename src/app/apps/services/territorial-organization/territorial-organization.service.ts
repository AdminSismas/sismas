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

  basic_url: string = `${environment.url}:${environment.port}`;

  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) {
  }

  getDataDeparments(): Observable<Department[]> {
    const url: string = `${this.basic_url}${environment.qbaunit_ccdpto}`;
    return this.requestsService.sendRequestsFetchGet(url);
  }

  getDataMunicipalities(dpto: string | null | undefined): Observable<Municipality[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('dpto', `${dpto}`);
    const url: string = `${this.basic_url}${environment.qbaunit_ccmpio}`;
    return this.getData(url, paramsMun);
  }

  getDataTownships(deptoMpio: string | null | undefined): Observable<Township[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('deptompio', `${deptoMpio}`);
    const url: string = `${this.basic_url}${environment.qbaunit_cccorr}`;
    return this.getData(url, paramsMun);
  }

  getDataZones(deptoMpio: string | null | undefined): Observable<Zone[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('deptompio', `${deptoMpio}`);
    const url: string = `${this.basic_url}${environment.qbaunit_cczona}`;
    return this.getData(url, paramsMun);
  }

  getDataSectors(ccZonaPkey: string | null | undefined): Observable<Sector[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('ccZonaPkey', `${ccZonaPkey}`);
    const url: string = `${this.basic_url}${environment.qbaunit_ccsector}`;
    return this.getData(url, paramsMun);
  }

  getDataCommunes(sectorPkey: string | null | undefined): Observable<Commune[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('sectorPkey', `${sectorPkey}`);
    const url: string = `${this.basic_url}${environment.qbaunit_cccomuna}`;
    return this.getData(url, paramsMun);
  }

  getDataNeighborhoods(communityPkey: string | null | undefined): Observable<Neighborhood[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('comunaPkey', `${communityPkey}`);
    const url: string = `${this.basic_url}${environment.qbaunit_ccbarrio}`;
    return this.getData(url, paramsMun);
  }

  getDataBlocks(neighborhoodPkey: string | null | undefined): Observable<Block[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('barrioPkey', `${neighborhoodPkey}`);
    const url: string = `${this.basic_url}${environment.qbaunit_ccmanzana}`;
    return this.getData(url, paramsMun);
  }

  getDataSidewalks(sectorPkey: string | null | undefined): Observable<Sidewalk[]> {
    let paramsMun: HttpParams = new HttpParams();
    paramsMun = paramsMun.append('sectorPkey', `${sectorPkey}`);
    const url: string = `${this.basic_url}${environment.qbaunit_ccvereda}`;
    return this.getData(url, paramsMun);
  }


  advancedSearch(valueUrlo: string): Observable<any[]> {
    let paramsMun: HttpParams = new HttpParams();
    const url: string = `${this.basic_url}/baunit/npnlike?npnlike=1800101040000030600069&page=0&size=4`;
    // const url: string = `${this.basic_url}/baunit/npnlike?npnlike=${valueUrlo}&page=0&size=20`;
    // return this.getData(url, paramsMun);
    return this.http.get<any>(url)
  }


  private getData(url: string, params: any): Observable<any[]> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }
}
