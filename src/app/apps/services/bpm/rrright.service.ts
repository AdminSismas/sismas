import { Injectable } from '@angular/core';
import { environment as env } from '../../../../environments/environments';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InfoOwners } from '../../interfaces/information-property/info-owners';
import { catchError, Observable } from 'rxjs';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { DeleteParamsRrright, ParamsRrright } from '../../interfaces/bpm/changes-property-owner';
import { InfoPerson } from '../../interfaces/information-property/info-person';

@Injectable({
  providedIn: 'root'
})
export class RrrightService {

  basic_url = `${env.url}:${env.port}${env.rrright}`;

  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService,
  ) { }

  getRrrightByBaUnitId( id: string, domain: string ): Observable<InfoOwners[]> | undefined {
    const url = `${this.basic_url}${domain}/${id}`;

    return this.http.get<InfoPerson>(url)
      .pipe(
        catchError(error => this.requestsService.errorNotFound(error))
      );
  }

  postRrrightOwnerProperty( parameters: ParamsRrright ): Observable<InfoOwners> {
    const { schema, executionId, baunitId, params } = parameters;

    const url = `${this.basic_url}${schema}/${executionId}/${baunitId}`;

    return this.http.post<InfoOwners>(url, params)
      .pipe(
        catchError(error => this.requestsService.errorNotFound(error))
      );
  }

  deletePropertyOwner( parameters: DeleteParamsRrright ): Observable<void> {
    const { executionId, baunitId, rightId } = parameters;

    const url: string = this.basic_url.slice(0, -1);

    const params = new HttpParams()
        .set('rightId', rightId.toString())
        .set('changeLogId', executionId)
        .set('baunitId', baunitId);

    return this.http.delete<void>(url, { params: params })
      .pipe(
        catchError(error => this.requestsService.errorNotFound(error))
      );
  }

  updatePropertyOwner(parameters: ParamsRrright) {
    const { executionId, baunitId, schema, params } = parameters;

    const url = `${this.basic_url}${schema}/${executionId}/${baunitId}`;

    return this.http.put(url, params)
      .pipe(
        catchError(error => this.requestsService.errorNotFound(error))
      );
  }
}
