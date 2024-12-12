import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { SendGeneralRequestsService } from './general/send-general-requests.service';
import { PageSortByData } from '../interfaces/page-sortBy-data.model';
import { Observable } from 'rxjs';
import { WorkflowCollection } from '../interfaces/workflow.model';
import { HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  /* -------------- ATRIBUTOS -------------- */
  basic_url:string = `${environment.url}:${environment.port}${environment.bpmProcess.value}`;

  /* -------------- CONSTRUCTOR -------------- */
  constructor(private requestsService: SendGeneralRequestsService) { }

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
}
