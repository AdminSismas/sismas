import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { SendGeneralRequestsService } from './general/send-general-requests.service';
import { PageSortByData } from '../interfaces/page-sortBy-data.model';
import { catchError, Observable, of } from 'rxjs';
import { CreateWorkflowParams, WorkflowCollection } from '../interfaces/workflow.model';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  /* -------------- ATRIBUTOS -------------- */
  basic_url:string = `${environment.url}:${environment.port}${environment.bpmProcess.value}`;

  /* -------------- CONSTRUCTOR -------------- */
  constructor(
    private requestsService: SendGeneralRequestsService,
    private http: HttpClient
  ) { }

  /* -------------- MÉTODOS -------------- */
  getDataPropertyByWorkflow(page:PageSortByData):Observable<WorkflowCollection[]> {
    const url: string = `${this.basic_url}`

    let paramsWF: HttpParams = new HttpParams();
    paramsWF = paramsWF.append('page', `${page.page}`)
    paramsWF = paramsWF.append('size', `${page.size}`)
    paramsWF = paramsWF.append('sortBy', `${page.sortBy}`)

    return this.getData(url, paramsWF);
  }

  private getData(url:string, params:any):Observable<WorkflowCollection[]> {
    return this.requestsService.sendRequestsGetOption(url, {params: params});
  }

  createWorkflow(params: CreateWorkflowParams): Observable<WorkflowCollection> {
    const url: string = `${this.basic_url}`

    console.log("params: ", params);

    return this.http.post<WorkflowCollection>(url, params)
      .pipe(
        catchError((error: any) =>{
          console.error('Hubo un error al crear el flujo de trabajo');
          throw error;
        })
      );
  }
}
