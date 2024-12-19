import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { BehaviorSubject, catchError, Observable } from 'rxjs';
import { PageSearchData } from '../../interfaces/page-search-data.model';
import { InformationPegeable } from '../../interfaces/information-pegeable.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { ProTaskE } from '../../interfaces/pro-task-e';

@Injectable({
  providedIn: 'root'
})
export class TasksPanelService {

  basic_url: string = `${envi.url}:${envi.port}${envi.bpmOperation.value}`;

  private _listProtaskE = new BehaviorSubject<ProTaskE>({});
  listProtaskE$ = this._listProtaskE.asObservable();

  constructor(
    private requestsService: SendGeneralRequestsService,
    private http: HttpClient
  ) {
    this.getChargerProTaskCount();
  }

  getChargerProTaskCount() {
    this.getProTaskCount()
      .subscribe((result: ProTaskE) => {
        this._listProtaskE.next(result)
        });
  }

  getProTaskCount(): Observable<ProTaskE> {
    const url: string = `${this.basic_url}${envi.bpmOperation.proTask_count}`;
    
    return this.requestsService.sendRequestsFetchGet(url)
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

  getProTaskAssigned(page: PageSearchData): Observable<InformationPegeable> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', `${page.page}`);
    paramsR = paramsR.append('size', `${page.size}`);
    const url: string = `${this.basic_url}${envi.bpmOperation.proTask_asigned}`;
    return this.getData(url, paramsR);
  }

  getProTaskDevolution(page: PageSearchData): Observable<InformationPegeable> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', `${page.page}`);
    paramsR = paramsR.append('size', `${page.size}`);
    const url: string = `${this.basic_url}${envi.bpmOperation.proTask_devolution}`;
    return this.getData(url, paramsR);
  }

  getProTaskPriority(page: PageSearchData): Observable<InformationPegeable> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', `${page.page}`);
    paramsR = paramsR.append('size', `${page.size}`);
    const url: string = `${this.basic_url}${envi.bpmOperation.proTask_priority}`;
    return this.getData(url, paramsR);
  }

  private getData(url: string, params: any): Observable<InformationPegeable> {
    return this.requestsService.sendRequestsGetOption(url, { params: params })
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

  viewTaskId(taskId: number): Observable<any> {
    const urlTask: string = `${this.basic_url}${envi.bpmOperation.proExecution}${taskId}`;
    console.log(urlTask);
    return this.http.get<any>(urlTask);
  }

  viewExecuteTaskId(page: PageSearchData,taskId:string): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('page', `${page.page}`);
    params = params.append('size', `${page.size}`);
    params = params.append('sortBy', `unitBuiltLabel`);


    const urlTask: string = `${this.basic_url}${envi.bpmOperation.proTask}${taskId}?page=${page.page}&size=${page.size}`;
    console.log(urlTask);
    return this.http.get<any>(urlTask,);
  }


}
