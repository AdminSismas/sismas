/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from './send-general-requests.service';
import { environment as envi, environment } from '../../../../environments/environments';
import { map, Observable } from 'rxjs';
import { InformationPegeable } from '../../interfaces/information-pegeable.model';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PageSearchData } from '../../interfaces/page-search-data.model';

@Injectable({
  providedIn: 'root'
})
export class ValidateInformationBaunitService {

  basic_url = `${environment.url}:${environment.port}`;
  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) { }

  getBaunitIdEInOtherProcess(baunitIdE: string):Observable<string> {
    const url = `${this.basic_url}${envi.bpmOperation.value}${envi.checkProcess}${baunitIdE}`;

    const headers = new HttpHeaders({ 'Content-Type': 'text/plain;charset=UTF-8;'})

    return this.http.get(url, { 
      responseType: 'text',
      headers: headers
    });
  }

  private getData(url:string, params:any):Observable<InformationPegeable>{
    return this.requestsService.sendRequestsGetOption(url, {params: params});
  }

  advancedSearchDa(page:PageSearchData,value:string):Observable<InformationPegeable> {

    let paramsA:HttpParams = new HttpParams();
     paramsA = paramsA.append('page', `${page.page}`);
     paramsA = paramsA.append('size', `${page.size}`);
     if (page.searchData.sidewalk !== null && page.searchData.sidewalk !== undefined && page.searchData.sidewalk.length > 10) {
       paramsA = paramsA.append('npnlike',`${page.searchData.sidewalk}`);
     }
     else if (page.searchData.block !== null && page.searchData.block !== undefined && page.searchData.block.length > 10) {
       paramsA = paramsA.append('npnlike',`${page.searchData.block}`);
     }

    // const url: string = `${this.basic_url}/baunit/npnlike?npnlike=1800101040000030600069&page=0&size=4`;
    const url = `${this.basic_url}/baunit/npnlike?npnlike=${value}&page=${page.page}&size=${page.size}`;
    // return this.getData(url, paramsMun);
    return this.http.get<InformationPegeable>(url);
  }


  advancedSearchCadastral(page:PageSearchData,value:string):Observable<InformationPegeable> {

    let paramsA:HttpParams = new HttpParams();
        paramsA = paramsA.append('page', `${page.page}`);
        paramsA = paramsA.append('size', `${page.size}`);
        if (page.searchData.sidewalk !== null && page.searchData.sidewalk !== undefined && page.searchData.sidewalk.length > 10) {
          paramsA = paramsA.append('npnlike',`${page.searchData.sidewalk}`);
        }
        else if (page.searchData.block !== null && page.searchData.block !== undefined && page.searchData.block.length > 10) {
          paramsA = paramsA.append('npnlike',`${page.searchData.block}`);
        }
        
        // const url:string = `${environment.url}:${environment.port}${environment.baunit_npnlike}${value}`;
    const url = `${this.basic_url}/baunit/npnlike?npnlike=${value}&page=${page.page}&size=${page.size}`;
    return this.http.get<InformationPegeable>(url);
    // return this.getData(url,paramsA).pipe();

  }

  historiAdvancedSearch(page:PageSearchData,value:string):Observable<InformationPegeable> {

    let paramsA:HttpParams = new HttpParams();
        paramsA = paramsA.append('page', `${page.page}`);
        paramsA = paramsA.append('size', `${page.size}`);
        if (page.searchData.sidewalk !== null && page.searchData.sidewalk !== undefined && page.searchData.sidewalk.length > 10) {
          paramsA = paramsA.append('npnlike',`${page.searchData.sidewalk}`);
        }
        else if (page.searchData.block !== null && page.searchData.block !== undefined && page.searchData.block.length > 10) {
          paramsA = paramsA.append('npnlike',`${page.searchData.block}`);
        }
        
        // const url:string = `${environment.url}:${environment.port}${environment.baunit_npnlike}${value}`;
    const url = `${this.basic_url}/baunit/npnlike?npnlike=${value}&page=${page.page}&size=${page.size}`;
    return this.http.get<InformationPegeable>(url);
    // return this.getData(url,paramsA).pipe();

  }

}
