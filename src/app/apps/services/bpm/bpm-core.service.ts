import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { environment as envi } from '../../../../environments/environments';
import { catchError, Observable, ReplaySubject } from 'rxjs';
import { ProTaskE } from '../../interfaces/bpm/pro-task-e';
import { ProFlow } from '../../interfaces/bpm/pro-flow';
import { ProExecutionE } from '../../interfaces/bpm/pro-execution-e';
import { DifferenceChanges } from '../../interfaces/bpm/difference-changes';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class BpmCoreService {

  private proTaskSubject = new ReplaySubject<ProTaskE>(1);
  proTask$ = this.proTaskSubject.asObservable();
  basic_url = `${envi.url}:${envi.port}${envi.bpmOperation.value}/`;

  constructor(
    private requestsService: SendGeneralRequestsService,
    private http: HttpClient
  ) {
  }

  getProTaskCountComment(id: string): Observable<number> {
    const url = `${this.basic_url}${envi.bpmOperation.comment}${id}${envi.bpmOperation.count}`;
    return this.requestsService.sendRequestsFetchGet(url)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

  getProTaskCountAttachment(id: string): Observable<number> {
    const basic_url = `${envi.url}:${envi.port}${envi.bpmAttachment.value}`;
    const url = `${basic_url}${envi.bpmAttachment.proExecution}${id}${envi.bpmAttachment.count}`;
    return this.requestsService.sendRequestsFetchGet(url)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

  getProFlow(flowId: string): Observable<ProFlow> {
    const url = `${this.basic_url}${envi.bpmOperation.proflow}${flowId}`;
    return this.requestsService.sendRequestsFetchGet(url)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

  getProFlowProExecution(executionId: string): Observable<ProFlow> {
    const url = `${this.basic_url}${envi.bpmOperation.proflow_proExecution}${executionId}`;
    return this.requestsService.sendRequestsFetchGet(url)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

  getNextOperation(executionId: string): Observable<ProTaskE> {

    const url = `${this.basic_url}${envi.bpmOperation.proExecution_next}${executionId}`;
    return this.requestsService.sendRequestsFetchPost(url);
  }

  getPreviewOperation(executionId: string): Observable<ProTaskE> {
    const url = `${this.basic_url}${envi.bpmOperation.proExecution_prev}${executionId}`;
    return this.requestsService.sendRequestsFetchPost(url);
  }

  bpmOperationStartProcess(proExecutionE: ProExecutionE): Observable<ProTaskE> {
    const url = `${this.basic_url}${envi.bpmOperation.startProcess}`;
    return this.requestsService.sendRequestsFetchPostBody(url, proExecutionE)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

  //{{url}}:{{port}}/temporal/{{executionId}}/check
  checkStatusBpmOperation(executionId: string): Observable<string[]> {
    const url = `${envi.url}:${envi.port}${envi.temporal}${executionId}${envi.check}`;
    return this.requestsService.sendRequestsFetchGet(url);
  }

  //{{url}}:{{port}}/compare/temp/{{executionId}}/{{baunitId}}
  viewChangesBpmOperationTemp(executionId: string, baunitId: string): Observable<DifferenceChanges[]> {
    const url = `${envi.url}:${envi.port}${envi.compare_temp}${executionId}/${baunitId}`;
    return this.requestsService.sendRequestsFetchGet(url);
  }

  updateProTask(proTaskE: ProTaskE) {
    this.proTaskSubject.next(proTaskE);
  }

  //{{url}}:{{port}}/temporal/clearBAUnit
  clearPropertyBpmOperation(executionId: string, baunitId: string): Observable<void> {
    const url = `${envi.url}:${envi.port}${envi.temporal}${envi.clearBaunit}`;
    const formData: FormData = new FormData();
    formData.append('changeLogId', executionId);
    formData.append('baunitId', baunitId);
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.delete<void>(url, { body: formData, headers })
      .pipe(catchError(error => {
        console.log('Error al remover la baunit');
        throw error;
      }));
  }

  bpmOperationGetFiled(executId: number): Observable<ProTaskE> {
    const url = `${this.basic_url}${envi.bpmOperation.value}${envi.bpmOperation.proTask}${executId}/active`;
    return this.requestsService.sendRequestsFetchGet(url)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }
}
