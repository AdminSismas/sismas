import { inject, Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { environment } from '../../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageSortByData } from '../../interfaces/general/page-sortBy-data.model';
import { InformationPegeable } from '../../interfaces/general/information-pegeable.model';


@Injectable({
  providedIn: 'root'
})
export class DomainLadmColService {
  /* -------------- ATRIBUTOS -------------- */
  basic_url = `${environment.url}:${environment.port}${environment.domain_domain}`;

  /* -------------- CONSTRUCTOR -------------- */
  constructor(private requestsService: SendGeneralRequestsService) {}
  private http = inject(HttpClient);


  /* -------------- MÉTODOS -------------- */
  getDataPropertyByDomainName(page: PageSortByData):Observable<InformationPegeable> {
    let params:HttpParams = new HttpParams();
    params = params.append('page', `${page.page}`);
    params = params.append('size', `${page.size}`);
    params = params.append('sortBy',`${page.sortBy}`);
    return this.http.get<InformationPegeable>(`${this.basic_url}`,{ params });
  }



}
