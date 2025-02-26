import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../../environments/environments';
import { SendGeneralRequestsService } from '../../general/send-general-requests.service';
import { Observable } from 'rxjs';
import { PageSearchData } from '../../../interfaces/general/page-search-data.model';
import { HttpParams } from '@angular/common/http';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';

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

  getParticipantsCitedProcess(page: PageSearchData, executionId: string): Observable<InformationPegeable> {
    let paramsA:HttpParams = new HttpParams();
    paramsA = paramsA.append('page', `${page.page}`)
    paramsA = paramsA.append('size', `${page.size}`)
    const url: string = `${this.basic_url}${envi.bpmOperation.participation}${executionId}${envi.typeNotification.cited}`;
    return this.getData(url,paramsA).pipe();
  }

  getParticipantsNotifiedProcess(page: PageSearchData, executionId: string): Observable<InformationPegeable> {
    let paramsA:HttpParams = new HttpParams();
    paramsA = paramsA.append('page', `${page.page}`)
    paramsA = paramsA.append('size', `${page.size}`)
    const url: string = `${this.basic_url}${envi.bpmOperation.participation}${executionId}${envi.typeNotification.notified}`;
    return this.getData(url,paramsA).pipe();
  }

  getParticipantsNotifyProcess(page: PageSearchData, executionId: string): Observable<InformationPegeable> {
    let paramsA:HttpParams = new HttpParams();
    paramsA = paramsA.append('page', `${page.page}`)
    paramsA = paramsA.append('size', `${page.size}`)
    const url: string = `${this.basic_url}${envi.bpmOperation.participation}${executionId}${envi.typeNotification.notify}`;
    return this.getData(url,paramsA).pipe();
  }

  private getData(url:string, params:any):Observable<InformationPegeable>{
    return this.requestsService.sendRequestsGetOption(url, {params: params});
  }
}
