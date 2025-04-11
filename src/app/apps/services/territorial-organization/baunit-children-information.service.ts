import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { HttpParams } from '@angular/common/http';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { catchError, Observable, tap } from 'rxjs';
import { Baunit, BAunitLike } from '../../interfaces/information-property/baunit-npnlike';
import { PageSearchData } from '../../interfaces/general/page-search-data.model';
import { InformationPegeable } from '../../interfaces/general/information-pegeable.model';

@Injectable({
  providedIn: 'root'
})
export class UnitPropertyInformationService {

  basic_url = `${envi.url}:${envi.port}`;

  constructor(
    private requestsService: SendGeneralRequestsService
  ) { }

  //{{url}}:{{port}}/baunit/baunitId
  getBaunitInformation( baunitId: string ): Observable<Baunit> {
    let url = `${this.basic_url}${envi.baunit_baunitId}`;
    url += `?baunitId=${baunitId}`;
    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }


  //{{url}}:{{port}}/baunit/npnlike
  getListUnitPropertyInformation(page: PageSearchData, npn: string): Observable<InformationPegeable> {
    let url = `${this.basic_url}${envi.baunit_npnlike}`;
    const npnlike: string = npn.toString().slice(0, 22);
    const paramsR: HttpParams = new HttpParams()
      .set('npnlike', `${npnlike}`)
      .set('page', `${page.page}`)
      .set('size', `${page.size}`);
    return this.requestsService.sendRequestsGetOption(url, { params: paramsR })
      .pipe(
        catchError(error => this.requestsService.errorNotFound(error)),
        tap((result: BAunitLike) => {
          const new_content = result.content.filter((baUnit: Baunit) => baUnit.cadastralNumber !== npn);
          result.content = new_content;
          return result;
        })
      );
  }
}
