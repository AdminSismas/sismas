/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { BehaviorSubject, catchError, distinctUntilChanged, map, Observable , EMPTY, throwError } from 'rxjs';
import { PageSearchData } from '@shared/interfaces';
import { InformationPegeable } from '@shared/interfaces';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { ProTaskE } from '@shared/interfaces';
import { TablaContent } from '@shared/interfaces';
import { TaskRetailExecuteResponseModel } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class TasksPanelService {

  basic_url = `${envi.url}:${envi.port}${envi.bpmOperation.value}/`;

  private _listProtaskE = new BehaviorSubject<ProTaskE>({});
  listProtaskE$ = this._listProtaskE.asObservable();

  constructor(
    private http: HttpClient
  ) { }

  getChargerProTaskCount() {
    this.getProTaskCount()
      .subscribe((result: ProTaskE) => {
        this._listProtaskE.next(result);
        });
  }

  getProTaskCount(): Observable<ProTaskE> {
    const url = `${this.basic_url}${envi.bpmOperation.proTask_count}`;

    return this.http.get<ProTaskE>(url)
      .pipe(
        catchError(error => (error.status === 404 ? EMPTY : throwError(() => error))),
        distinctUntilChanged()
      );
  }

  getProTaskAssigned(page: PageSearchData): Observable<InformationPegeable> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', `${page.page}`);
    paramsR = paramsR.append('size', `${page.size}`);
    const url = `${this.basic_url}${envi.bpmOperation.proTask_asigned}`;
    return this.getData(url, paramsR);
  }

  getProTaskDevolution(page: PageSearchData): Observable<InformationPegeable> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', `${page.page}`);
    paramsR = paramsR.append('size', `${page.size}`);
    const url = `${this.basic_url}${envi.bpmOperation.proTask_devolution}`;
    return this.getData(url, paramsR);
  }

  getProTaskPriority(page: PageSearchData): Observable<InformationPegeable> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', `${page.page}`);
    paramsR = paramsR.append('size', `${page.size}`);
    const url = `${this.basic_url}${envi.bpmOperation.proTask_priority}`;
    return this.getData(url, paramsR);
  }

  private getData(url: string, params: any): Observable<InformationPegeable> {
    return this.http.get<any>(url, { params: params  })
      .pipe(catchError(error => (error.status === 404 ? EMPTY : throwError(() => error))));
  }

  viewTaskId(executionId: string): Observable<TablaContent> {
    const urlTask = `${this.basic_url}${envi.bpmOperation.proExecution}${executionId}`;
    return this.http.get<TablaContent>(urlTask);
  }

  viewProTaskId(taskId: number): Observable<TaskRetailExecuteResponseModel> {
    const urlTask = `${this.basic_url}${envi.bpmOperation.proTask}${taskId}/active`;
    return this.http.get<TaskRetailExecuteResponseModel>(urlTask);
  }


  viewExecuteTaskId(page: PageSearchData,taskId:string): Observable<any> {
    const urlTask = `${this.basic_url}${envi.bpmOperation.proTask}${taskId}?page=${page.page}&size=${page.size}`;
    return this.http.get<any>(urlTask,);
  }

  getResources(executionId: string): Observable<string[]> {
    const { proflow, proExecution, resources } = envi.bpmOperation;
    const url = `${this.basic_url}${proflow}${proExecution}${resources}${executionId}`;
    const headers: HttpHeaders = new HttpHeaders()
      .set('Content-Type', 'text/plain;charset=UTF-8');
    return  this.http.get(url, { headers, responseType: 'text' })
      .pipe(
        map((result: string) => result.split(',').map((resource: string) => resource.trim()))
      );
  }

  getSearchTask(term: string, pageable = { page: '0', size: '10' }): Observable<InformationPegeable> {
    const url = `${this.basic_url}${envi.bpmOperation.proTask}${term}${envi.term}`;

    const params = new HttpParams()
      .set('page', pageable.page.toString())
      .set('size', pageable.size.toString());

    return this.http.get<InformationPegeable>(url, { params });
  }
}
