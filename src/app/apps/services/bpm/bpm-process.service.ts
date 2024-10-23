import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { catchError, Observable } from 'rxjs';
import { HttpParams } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { BpmTypeProcess } from '../../interfaces/bpm/bpm-type-process';

@Injectable({
  providedIn: 'root'
})
export class BpmProcessService {
  basic_url: string = `${environment.url}:${environment.port}${environment.bpmProcess.value}`;

  constructor(
    private requestsService: SendGeneralRequestsService
  ) {
  }

  getProceduresByCategory(category: string): Observable<BpmTypeProcess[]> {
    let url = `${this.basic_url}${environment.bpmProcess.category}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('category', `${category}`);
    return this.requestsService.sendRequestsGetOption(url, { params: paramsR })
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

  getListDocumentsByProcessId(processId: string): Observable<string[]> {
    let url = `${this.basic_url}${environment.bpmProcess.prodocumentStr}${processId}`;
    return this.requestsService.sendRequestsFetchGet(url)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

}
