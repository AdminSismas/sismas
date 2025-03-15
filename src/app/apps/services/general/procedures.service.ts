/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { SendGeneralRequestsService } from './send-general-requests.service';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { PageProceduresData } from '../../interfaces/general/page-procedures-data.model';
import { Observable } from 'rxjs';
import { ProceduresCollection } from '../../interfaces/tables/procedures-progress.model';
import { InformationPegeable } from '../../interfaces/general/information-pegeable.model';
import { ProTaskE } from '../../interfaces/bpm/pro-task-e';

@Injectable({
  providedIn: 'root'
})
export class ProceduresService {
  /* -------------- ATRIBUTOS -------------- */
  basic_url = `${envi.url}:${envi.port}${envi.bpmOperation.value}${envi.proExecution}`;

  /* -------------- CONSTRUCTOR -------------- */
  constructor(
    private requestsService: SendGeneralRequestsService,
    private http: HttpClient
  ) {
  }

  /* -------------- MÉTODOS -------------- */
  getDataPropertyByProcedures(
    page: PageProceduresData
  ): Observable<ProceduresCollection[]> {
    const url = `${this.basic_url}${envi.active}`;

    let paramsPP: HttpParams = new HttpParams();
    paramsPP = paramsPP.append('page', `${page.page}`);
    paramsPP = paramsPP.append('size', `${page.size}`);
    paramsPP = paramsPP.append('beginAt', `${page.beginAt}`);
    paramsPP = paramsPP.append('beginAtE', `${page.beginAtE}`);
    paramsPP = paramsPP.append('executionCode', `${page.executionCode}`);
    paramsPP = paramsPP.append('individualNumber', `${page.individualNumber}`);

    return this.getData(url, paramsPP);
  }

  private getData(
    url: string,
    params: any
  ): Observable<ProceduresCollection[]> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }

  public getFilterTableEjecutionService(
    page: PageProceduresData,
    urlMain: string
  ): Observable<InformationPegeable> {
    const urlComplete = `${this.basic_url}/${urlMain}?page=${page.page}&size=${page.size}&beginAt=${page.beginAt}&beginAtE=${page.beginAtE}&executionCode=${page.executionCode}&individualNumber=${page.individualNumber}`;
    return this.http.get<InformationPegeable>(urlComplete);
  }

  public getFilterTableHistoryService(
    page: PageProceduresData
  ): Observable<ProceduresCollection[]> {
    const urlComplete = `${this.basic_url}/${envi.active}?page=${page.page}&size=${page.size}&beginAt=${page.beginAt}&beginAtE=${page.beginAtE}&executionCode=${page.executionCode}&individualNumber=${page.individualNumber}`;
    return this.http.get<any>(urlComplete);
  }

  // /bpmOperation/proExecution/baunitId/active/{{baunitId}}?page=0&size=10
  public getFilterHistoryService(page: PageProceduresData): Observable<ProceduresCollection[]> {
    const urlComplete = `${this.basic_url}${envi.baunitId}${envi.finish}${page.executionCode}`;
    const params: HttpParams = new HttpParams()
      .set('page', page.page!.toString())
      .set('size', page.size!.toString());
    return this.http.get<any>(urlComplete, { params });
  }


  //{{url}}:{{port}}/bpmOperation/proExecution/baunitId/finish/{{baunitId}}?page=0&size=10
  getBaUnitHistoricProcedures(baUnitId: number | string, page: PageProceduresData): Observable<InformationPegeable> {
    const url = `${this.basic_url}${envi.baunitId}${envi.finish}${baUnitId}`;
    const params: HttpParams = new HttpParams()
      .set('page', `${page.page!}`)
      .set('size', `${page.size!}`);
    return this.http.get<InformationPegeable>(url, { params });
  }

  //{{url}}:{{port}}/bpmOperation/proExecution/baunitId/active/{{baunitId}}?page=0&size=10
  getBaUnitActiveProcedures(baUnitId: number | string, page: PageProceduresData): Observable<InformationPegeable> {
    const url = `${this.basic_url}${envi.baunitId}/${envi.active}/${baUnitId}`;
    const params: HttpParams = new HttpParams()
      .set('page', `${page.page!}`)
      .set('size', `${page.size!}`);
    return this.http.get<InformationPegeable>(url, { params });
  }

  viewDetailIdProcedures(taskId: number): Observable<any> {
    return this.http.get<any>(`${this.basic_url}/${taskId}`);
  }

  formatDate(date: Date | string, format = 'dd/MM/yyyy'): string {
    const dateObj = new Date(date);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();
    return format
      .replace('dd', day)
      .replace('MM', month)
      .replace('yyyy', String(year));
  }

  commentProcedure(
    executionId: number | string,
    commentText: string
  ): Observable<unknown> {
    const url = `${environment.url}:${environment.port}${environment.bpmOperation.value}${environment.comment}${executionId}`;
    return this.http.post<unknown>(url, { commentText });
  }

  // {{url}}:{{port}}/bpmOperation/proExecution/{{executionId}}/cancel
  cancelProcedure(executionId: number): Observable<string> {
    const url = `${this.basic_url}/${executionId}${envi.cancel}`;
    return this.http.put<string>(url, { responseType: 'text' });
  }

  reassignProcedure(
    executionId: number,
    username: string,
    userId: number
  ): Observable<ProTaskE> {
    const url = `${envi.url}:${envi.port}${envi.bpmOperation.value}/${envi.bpmOperation.proTask}${envi.reassign}${executionId}`;
    const body = new FormData();
    body.append('username', username);
    body.append('userId', `${userId}`);
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.put<ProTaskE>(url, body, {
      headers
    });
  }
}
