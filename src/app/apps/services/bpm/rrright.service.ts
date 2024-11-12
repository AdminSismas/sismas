import { Injectable } from '@angular/core';
import { environment as env } from '../../../../environments/environments';
import { HttpClient } from '@angular/common/http';
import { InfoOwners } from '../../interfaces/information-property/info-owners';
import { catchError, Observable } from 'rxjs';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';

@Injectable({
  providedIn: 'root'
})
export class RrrightService {

  basic_url: string = `${env.url}:${env.port}${env.rrright}`;

  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) { }

  getTempRrrightByBaUnitId( id: string, domain: string ): Observable<InfoOwners[]> | undefined {
    let url: string = `${this.basic_url}${domain}/${id}`;

    return this.http.get<InfoOwners[]>(url)
      .pipe(
        catchError(error => this.requestsService.errorNotFound(error))
      )
  }
}
