import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { PageSortByData } from '@shared/interfaces';
import { InformationPegeable } from '@shared/interfaces';


@Injectable({
  providedIn: 'root'
})
export class DomainLadmColService {
  /* -------------- ATRIBUTOS -------------- */
  basic_url = `${environment.url}:${environment.port}${environment.domain_domain}`;

  /* -------------- CONSTRUCTOR -------------- */
  constructor(
    private http: HttpClient
  ) {}



  /* -------------- MÉTODOS -------------- */
  getDataPropertyByDomainName(page: PageSortByData):Observable<InformationPegeable> {
    let params:HttpParams = new HttpParams();
    params = params.append('page', `${page.page}`);
    params = params.append('size', `${page.size}`);
    params = params.append('sortBy',`${page.sortBy}`);
    return this.http.get<InformationPegeable>(`${this.basic_url}`,{ params });
  }



}
