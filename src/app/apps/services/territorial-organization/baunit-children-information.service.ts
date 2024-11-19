import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { HttpParams } from '@angular/common/http';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { catchError, Observable, tap } from 'rxjs';
import { Baunit, BAunitLike } from '../../interfaces/information-property/baunit-npnlike';

@Injectable({
  providedIn: 'root'
})
export class UnitPropertyInformationService {

  basic_url: string = `${envi.url}:${envi.port}`;

  constructor(
    private requestsService: SendGeneralRequestsService
  ) { }

  getBaunitInformation( baunitId: string ): Observable<Baunit> {
    let url: string = `${this.basic_url}${envi.baunit_baunitId}`;

    url += `?baunitId=${baunitId}`;

    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

  getUnitPropertyInformation(
    npn: string, page: number = 0, size: number = 7
  ): Observable<BAunitLike> {
    let url: string = `${this.basic_url}${envi.baunit_npnlike}`;

    let npnlike: string = npn.toString().slice(0, 22);
    let pageString: string = page.toString();
    let sizeString: string = size.toString();

    const params: HttpParams = new HttpParams()
      .set('npnlike', npnlike)
      .set('page', pageString)
      .set('size', sizeString);

    url += `?${params.toString()}`;

    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(
        catchError(error => this.requestsService.errorNotFound(error)),
        tap((result: BAunitLike) => {
          let new_content = result.content.filter((baUnit: Baunit) => baUnit.cadastralNumber !== npn)
          result.content = new_content;
          return result;
        })
      );
  }
}
