import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from './send-general-requests.service';
import { environment as envi, environment } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { InformationPegeable } from '../../interfaces/information-pegeable.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ValidateInformationBaunitService {

  basic_url:string = `${environment.url}:${environment.port}`;
  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) { }

  async getBaunitIdEInOtherProcess(baunitIdE: string):Promise<boolean> {
    //const url: string = `${this.basic_url}${envi.bpmOperation.proflow}${flowId}`;
    //return this.requestsService.sendRequestsFetchGetAsync(url);
    return true;
  }

  private getData(url:string, params:any):Observable<InformationPegeable>{
    return this.requestsService.sendRequestsGetOption(url, {params: params});
  }

  advancedSearch(valueUrlo: string):Observable<InformationPegeable> {
    // const url: string = `${this.basic_url}/baunit/npnlike?npnlike=1800101040000030600069&page=0&size=4`;
    const url: string = `${this.basic_url}/baunit/npnlike?npnlike=${valueUrlo}&page=0&size=20`;
    // return this.getData(url, paramsMun);
    return this.http.get<InformationPegeable>(url)
  }

}
