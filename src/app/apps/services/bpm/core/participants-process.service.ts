import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../../environments/environments';
import { SendGeneralRequestsService } from '../../general/send-general-requests.service';
import { ProTaskE } from '../../../interfaces/pro-task-e';
import { catchError, Observable } from 'rxjs';
import { PageSearchData } from '../../../interfaces/page-search-data.model';
import { InformationPegeable } from '../../../interfaces/information-pegeable.model';
import { HttpParams } from '@angular/common/http';
import { ProcessParticipant } from '../../../interfaces/bpm/process-participant';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsProcessService {

  basic_url: string = `${envi.url}:${envi.port}${envi.bpmOperation.value}`;

  constructor(
    private requestsService: SendGeneralRequestsService
  ) { }

  getParticipantsProcess(page: PageSearchData, executionId: string): Observable<InformationPegeable> {
    let paramsA:HttpParams = new HttpParams();
    paramsA = paramsA.append('page', `${page.page}`)
    paramsA = paramsA.append('size', `${page.size}`)
    const url: string = `${this.basic_url}${envi.bpmOperation.participation}${executionId}`;
    return this.getData(url,paramsA).pipe();
  }

  private getData(url:string, params:any):Observable<InformationPegeable>{
    return this.requestsService.sendRequestsGetOption(url, {params: params});
  }
}
