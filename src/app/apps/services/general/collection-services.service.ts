import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from './send-general-requests.service';
import { environment } from '../../../../environments/environments';
import { Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { DomainCalificationCollection, DomainCollection } from '../../interfaces/domain-name.model';

@Injectable({
  providedIn: 'root'
})
export class CollectionServicesService {

  basic_url:string = `${environment.url}:${environment.port}${environment.domain_domainName}?`;
  calification_url:string = `${environment.url}:${environment.port}${environment.calificationUB}`;
  constructor(
    private requestsService: SendGeneralRequestsService
  ) { }

  getDataDomainName(domainName:string):Observable<DomainCollection[]> {
    let paramsR:HttpParams = new HttpParams();
    paramsR = paramsR.append('domainName', `${domainName}`);
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
