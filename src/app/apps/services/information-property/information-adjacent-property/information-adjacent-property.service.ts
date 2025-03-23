import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../../environments/environments';
import { SendGeneralRequestsService } from '../../general/send-general-requests.service';
import { catchError, Observable } from 'rxjs';
import { InformationAdjacent } from '../../../interfaces/information-property/information-adjacent';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class InformationAdjacentPropertyService {

  basic_url = `${envi.url}:${envi.port}`;

  constructor(
    private requestsService: SendGeneralRequestsService
  ) {
  }

  getBasicInformationPropertyAdjacent(baUnitId: string): Observable<InformationAdjacent[]> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.baunit}/${baUnitId}`;
    return this.requestsService.sendRequestsFetchGet(url)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }

  getInformationPropertyTemporalAdjacent(
    page: number, size: number,
    baUnitId: string): Observable<InformationPegeable> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.baunit}${envi.page}${baUnitId}`;
    const params: HttpParams = new HttpParams()
      .set('page', `${page}`)
      .set('size', `${size}`);
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  //POST: {{url}}:{{port}}/ccColindante/temp/{{executionId}}/{{baUnitId}}
  createInformationPropertyAdjacent(executionId: string, baUnitId: string,
                                    data: InformationAdjacent): Observable<InformationAdjacent> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.schemas.temp}/${executionId}/${baUnitId}`;
    return this.requestsService.sendRequestsFetchPostBody(url, data)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }

  //PUT: {{url}}:{{port}}/ccColindante/temp/{{executionId}}/{{baUnitId}}
  updateInformationPropertyAdjacent(executionId: string, baUnitId: string,
                                    data: InformationAdjacent): Observable<InformationAdjacent> {
    const url = `${this.basic_url}${envi.ccColindante}${envi.schemas.temp}/${executionId}/${baUnitId}`;
    return this.requestsService.sendRequestsUpdatePutBody(url, data)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }

  deleteAdjacent(executionId: string, schema: string, baUnitId: string,
                 ccColindanteBaunitId: number): Observable<void> {
    const url = `${this.basic_url}${envi.ccColindante}`;
    const formData = new FormData();
    formData.append('word', 'borrar');
    return this.requestsService.sendDeleteFetch(url);
  }


  private getData(url: string, params: any): Observable<any> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }

}
