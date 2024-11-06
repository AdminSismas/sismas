import { inject, Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { catchError, Observable } from 'rxjs';
import { BAunitLike } from '../../interfaces/information-property/baunit-npnlike';

@Injectable({
  providedIn: 'root'
})
export class BaunitChildrenInformationService {

  basic_url: string = `${envi.url}:${envi.port}`;

  constructor(
    private requestsService: SendGeneralRequestsService
  ) { }


  getBaunitChildrenInformation(
    npn: bigint, page: number = 0, size: number = 20
  ): Observable<BAunitLike> {
    let url: string = `${this.basic_url}${envi.baunit_npnlike}`;

    let npnlike: string = npn.toString();
    let pageString: string = page.toString();
    let sizeString: string = size.toString();

    const params: HttpParams = new HttpParams()
      .set('npnlike', npnlike)
      .set('page', pageString)
      .set('size', sizeString);

    url += `?${params.toString()}`;

    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }
}
