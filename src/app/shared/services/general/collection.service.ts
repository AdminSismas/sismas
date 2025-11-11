import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environments';
import { DomainCalificationCollection, DomainCollection } from '@shared/interfaces/forms';

@Injectable({
  providedIn: 'root'
})
export class CollectionServices {
  private readonly http = inject(HttpClient);

  private readonly basic_url = `${environment.url}:${environment.port}${environment.domain_domainName}?`;
  private readonly calification_url = `${environment.url}:${environment.port}${environment.calificationUB}`;

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
    return this.http.get<DomainCalificationCollection[]>(url);
  }


  private getData(url:string, params:any):Observable<DomainCollection[]>{
    return this.http.get<any>(url, { params: params });
  }
}
