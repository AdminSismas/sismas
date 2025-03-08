import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from './send-general-requests.service';
import { environment } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { DomainCalificationCollection, DomainCollection } from '../../interfaces/general/domain-name.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionServices {

  basic_url = `${environment.url}:${environment.port}${environment.domain_domainName}?`;
  calification_url = `${environment.url}:${environment.port}${environment.calificationUB}`;
  constructor(
    private requestsService: SendGeneralRequestsService
  ) { }

  getDataDomainName(domainName:string):Observable<DomainCollection[]> {
    let paramsR:HttpParams = new HttpParams();
    paramsR = paramsR.append('domainName', `${domainName}`);
    return this.getData(`${this.basic_url}`,paramsR);
  }

  getDataDomainNameParams(params:HttpParams):Observable<DomainCollection[]> {
    return this.getData(`${this.basic_url}`,params);
  }

  getAllDataAllBuiltUseOptions(domainName:string, active:boolean):Observable<DomainCollection[]> {
    let paramsR:HttpParams = new HttpParams();
    paramsR = paramsR.append('domainName', `${domainName}`);
    paramsR = paramsR.append('active', active);
    return this.getData(`${this.basic_url}`,paramsR);
  }

  getCalificationDataDomainName(domainName:string):Observable<DomainCalificationCollection[]> {
    return this.getCalificationData(`${this.calification_url}/${domainName}`);
  }


  private getCalificationData(url:string):Observable<DomainCalificationCollection[]>{
    return this.requestsService.sendRequestsGetOption(url, {});
  }


  private getData(url:string, params:any):Observable<DomainCollection[]>{
    return this.requestsService.sendRequestsGetOption(url, {params: params});
  }
}
