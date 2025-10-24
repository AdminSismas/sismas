import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { Observable, ReplaySubject } from 'rxjs';
import { ProTaskE } from '../../interfaces/bpm/pro-task-e';
import { ProFlow } from '../../interfaces/bpm/pro-flow';
import { ProExecutionE } from '../../interfaces/bpm/pro-execution-e';
import { DifferenceChanges } from '../../interfaces/bpm/difference-changes';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { MetadataBpm } from '../../interfaces/bpm/metadata-bpm';

@Injectable({
  providedIn: 'root'
})
export class BpmCoreService {

  private proTaskSubject = new ReplaySubject<ProTaskE>(1);
  proTask$ = this.proTaskSubject.asObservable();
  basic_url = `${envi.url}:${envi.port}${envi.bpmOperation.value}`;

  constructor(
    private http: HttpClient
  ) {
  }

  getProTaskCountComment(id: string): Observable<number> {
    const url = `${this.basic_url}${envi.bpmOperation.comment}/${id}${envi.bpmOperation.count}`;
    return this.http.get<number>(url);
  }

  getProTaskCountAttachment(id: string): Observable<number> {
    const basic_url = `${envi.url}:${envi.port}${envi.bpmAttachment.value}`;
    const url = `${basic_url}${envi.bpmAttachment.proExecution}${id}${envi.bpmAttachment.count}`;
    return this.http.get<number>(url);
  }

  getProFlow(flowId: string): Observable<ProFlow> {
    const url = `${this.basic_url}/${envi.bpmOperation.proflow}${flowId}`;
    return this.http.get<ProFlow>(url);
  }

  getProFlowProExecution(executionId: string): Observable<ProFlow> {
    const { proflow, proExecution } = envi.bpmOperation;
    const url = `${this.basic_url}/${proflow}${proExecution}${executionId}`;
    return this.http.get<ProFlow>(url);
  }

  getNextOperation(executionId: string, answer: boolean): Observable<ProTaskE> {
    const { proExecution, next } = envi.bpmOperation;
    const url = `${this.basic_url}/${proExecution}${next}/${executionId}/${answer}`;
    return this.http.post<ProTaskE>(url, {});
  }

  getPreviewOperation(executionId: string): Observable<ProTaskE> {
    const { proExecution, prev } = envi.bpmOperation;
    const url = `${this.basic_url}/${proExecution}${prev}/${executionId}`;
    return this.http.post<ProTaskE>(url, {});
  }

  bpmOperationStartProcess(proExecutionE: ProExecutionE): Observable<ProTaskE> {
    const url = `${this.basic_url}/${envi.bpmOperation.startProcess}`;
    return this.http.post<ProTaskE>(url, proExecutionE);
  }

  //{{url}}:{{port}}/temporal/{{executionId}}/check
  checkStatusBpmOperation(executionId: string): Observable<string[]> {
    const url = `${envi.url}:${envi.port}${envi.temporal}${executionId}${envi.check}`;
    return this.http.get<string[]>(url);
  }

  /*
  * Compare Temporal
  * */

  //{{url}}:{{port}}/compare/temp/{{executionId}}/{{baunitId}}
  viewChangesBpmOperationTemp(executionId: string, baunitId: string): Observable<DifferenceChanges[]> {
    const url = `${envi.url}:${envi.port}${envi.compare_temp}${executionId}/${baunitId}`;

    return this.http.get<DifferenceChanges[]>(url);
  }
  /*
  * Compare History
  * */

  //{{url}}:{{port}}/compare/hist/{{executionId}}/{{baunitId}}
  viewChangesBpmOperationHistory(executionId: string, baunitId: string): Observable<DifferenceChanges[]> {
    const url = `${envi.url}:${envi.port}${envi.compare_hist}${executionId}/${baunitId}`;

    return this.http.get<DifferenceChanges[]>(url);
  }

  updateProTask(proTaskE: ProTaskE) {
    this.proTaskSubject.next(proTaskE);
  }

  //{{url}}:{{port}}/temporal/clearBAUnit
  clearPropertyBpmOperation(executionId: string, baUnitId: string): Observable<void> {
    const params: HttpParams = new HttpParams()
      .set('baunitId', `${baUnitId}`)
      .set('changeLogId', `${executionId}`);
    return this.http.delete<void>(
      `${envi.url}:${envi.port}${envi.temporal}${envi.clearBaunit}`, { params });
  }

  createMasterFromNph(baunitId: string, executionId: string, condition: string): Observable<void> {
    const url = `${envi.url}:${envi.port}${envi.temporal}${envi.BAUnitCreateMasterFromNph}`;

    const formData = new FormData();
    formData.append('baunitId', `${baunitId}`);
    formData.append('changeLogId', `${executionId}`);
    formData.append('domBaunitCondition', `${condition}`);

    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });

    return this.http.post<void>(url, formData, { headers });
  }

  getBpmOperationChanges(executionId: string): Observable<Blob> {
    const url = `${envi.url}:${envi.port}${envi.bpmResolution.value}/${envi.bpmResolution.report}/${executionId}`;

    return this.http.get(url, { responseType: 'blob' });
  }

  getProcessMetadata(executionId: string): Observable<MetadataBpm[]> {
    const url = `${this.basic_url}${envi.bpmOperation.metadata}/${executionId}`;

    return this.http.get<MetadataBpm[]>(url);
  }
}
