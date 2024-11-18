import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from './general/send-general-requests.service';
import { environment } from '../../../environments/environments';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { DomainCollection } from '../interfaces/domain-name.model';
import { PageSortByData } from '../interfaces/page-sortBy-data.model';


@Injectable({
  providedIn: 'root'
})
export class DomainLadmColService {
  /* -------------- ATRIBUTOS -------------- */
  basic_url:string = `${environment.url}:${environment.port}${environment.domain_domain}`;

  /* -------------- CONSTRUCTOR -------------- */
  constructor(private requestsService: SendGeneralRequestsService) {}


  /* -------------- MÉTODOS -------------- */
  getDataPropertyByDomainName(page: PageSortByData):Observable<DomainCollection[]> {
    let paramsDN:HttpParams = new HttpParams();
    paramsDN = paramsDN.append('page', `${page.page}`)
    paramsDN = paramsDN.append('size', `${page.size}`)
    paramsDN = paramsDN.append('sortBy',`${page.sortBy}`)
    return this.getData(`${this.basic_url}`,paramsDN);
  }


  private getData(url:string, params:any):Observable<DomainCollection[]>{
    return this.requestsService.sendRequestsGetOption(url, {params: params});
  }



}
