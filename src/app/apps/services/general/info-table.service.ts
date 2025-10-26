/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { InformationPegeable } from '@shared/interfaces';
import { PageSearchData } from '@shared/interfaces';
import { Injectable } from '@angular/core';
@Injectable({
  providedIn: 'root'
})
export class InfoTableService {

  basic_url = `${environment.url}:${environment.port}${environment.baunit_attributes}`;

  constructor(
    private http: HttpClient
  ) { }

  getDataPropertyByRegistration(page:PageSearchData):Observable<InformationPegeable> {
    let paramsR:HttpParams = new HttpParams();
    paramsR = paramsR.append('page', `${page.page}`);
    paramsR = paramsR.append('size', `${page.size}`);
    paramsR = paramsR.append('matricula',`${page.searchData.registration}`);
    const url = `${this.basic_url}${environment.baunit_attributes_registration}`;
    return this.getData(url,paramsR);
  }

  getDataPropertyByDocument(page:PageSearchData):Observable<InformationPegeable> {
    let paramsD:HttpParams = new HttpParams();
    paramsD = paramsD.append('page', `${page.page}`);
    paramsD = paramsD.append('size', `${page.size}`);
    paramsD = paramsD.append('number',`${page.searchData.number}`);
    paramsD = paramsD.append('domIndividualTypeNumber',`${page.searchData.domIndividualTypeNumber}`);
    const url = `${this.basic_url}${environment.baunit_attributes_document}`;
    return this.getData(url,paramsD);
  }

  getDataPropertyByName(page:PageSearchData):Observable<InformationPegeable> {
    let paramsN:HttpParams = new HttpParams();
    paramsN = paramsN.append('page', `${page.page}`);
    paramsN = paramsN.append('size', `${page.size}`);
    paramsN = paramsN.append('firstName',`${page.searchData.firstName}`);
    paramsN = paramsN.append('middleName',`${page.searchData.middleName}`);
    paramsN = paramsN.append('lastName',`${page.searchData.lastName}`);
    paramsN = paramsN.append('otherLastName',`${page.searchData.otherLastName}`);
    paramsN = paramsN.append('companyName',`${page.searchData.companyName}`);
    const url = `${this.basic_url}${environment.baunit_attributes_name}`;
    return this.getData(url,paramsN);
  }

  getDataPropertyByAddress(page:PageSearchData):Observable<InformationPegeable> {
    let paramsA:HttpParams = new HttpParams();
    paramsA = paramsA.append('page', `${page.page}`);
    paramsA = paramsA.append('size', `${page.size}`);
    paramsA = paramsA.append('direccionTexto',`${page.searchData.textAddress}`);
    const url = `${this.basic_url}${environment.baunit_attributes_address}`;
    return this.getData(url,paramsA).pipe();
  }

  getDataNationalPredialNumber(page:PageSearchData):Observable<InformationPegeable> {
    let paramsA:HttpParams = new HttpParams();
    paramsA = paramsA.append('page', `${page.page}`);
    paramsA = paramsA.append('size', `${page.size}`);
    if (page.searchData.sidewalk !== null && page.searchData.sidewalk !== undefined && page.searchData.sidewalk.length > 10) {
      paramsA = paramsA.append('npnlike',`${page.searchData.sidewalk}`);
    }
    else if (page.searchData.block !== null && page.searchData.block !== undefined && page.searchData.block.length > 10) {
      paramsA = paramsA.append('npnlike',`${page.searchData.block}`);
    }
    const url = `${environment.url}:${environment.port}${environment.baunit_npnlike}`;
    return this.getData(url,paramsA).pipe();
  }

  getDataBaUnitIdE(page: number, size: number, baunit: string): Observable<InformationPegeable> {
    const url = `${this.basic_url}${environment.baunit}`;
    const params: HttpParams = new HttpParams().set('page', page)
      .set('size', size).set('baunit', baunit);
    return this.http.get<InformationPegeable>(url, { params });
  }

  private getData(url:string, params:any):Observable<InformationPegeable>{
    return this.http.get<any>(url, { params: params });
  }
}
