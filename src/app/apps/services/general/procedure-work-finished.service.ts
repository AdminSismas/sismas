import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environments';
import { SendGeneralRequestsService } from './send-general-requests.service';
import { HttpClient, HttpParams } from '@angular/common/http';
import { PageProceduresData } from '../../interfaces/general/page-procedures-data.model';
import { Observable } from 'rxjs';
import { ProceduresCollection } from '../../interfaces/tables/procedures-progress.model';

@Injectable({
  providedIn: 'root'
})
export class ProcedureWorkFinishedService {
  /* -------------- ATRIBUTOS -------------- */
  basic_url = `${environment.url}:${environment.port}${environment.bpmOperation.value}${environment.proExecution.value}${environment.active}`;

  /* -------------- CONSTRUCTRO -------------- */
  constructor(
    private requestsService: SendGeneralRequestsService,
    private http: HttpClient
  ) {}

  /* -------------- MÉTODOS -------------- */
  getDataPropertyByWorkFinishedProcedures(
    page: PageProceduresData
  ): Observable<ProceduresCollection[]> {
    let paramsPP: HttpParams = new HttpParams();
    paramsPP = paramsPP.append('page', `${page.page}`);
    paramsPP = paramsPP.append('size', `${page.size}`);
    paramsPP = paramsPP.append('beginAt', `${page.beginAt}`);
    paramsPP = paramsPP.append('beginAtE', `${page.beginAtE}`);
    paramsPP = paramsPP.append('executionCode', `${page.executionCode}`);
    paramsPP = paramsPP.append('individualNumber', `${page.individualNumber}`);
    // '{{url}}:{{port}}/bpmOperation/proExecution/finished?page=0&size=10&beginAt=05/01/2024&beginAtE=&executionCode=0&individualNumber='
    return this.http.get<ProceduresCollection[]>(`${this.basic_url}?`, {
      params: paramsPP
    });
  }

  public getFilterTableProcedureService(
    page: PageProceduresData
  ): Observable<ProceduresCollection[]> {
    const paramsR: HttpParams = new HttpParams()
      .append('page', `${page.page}`)
      .append('size', `${page.size}`)
      .append('beginAt', `${page.beginAt}`)
      .append('beginAtE', `${page.beginAtE}`)
      .append('executionCode', `${page.executionCode}`)
      .append('individualNumber', `${page.individualNumber}`);
    const urlComplete = `${environment.url}:${environment.port}/bpmOperation${environment.proExecution.value}${environment.finished}`;

    return this.http.get<ProceduresCollection[]>(urlComplete, {
      params: paramsR
    });
  }

  public viewDetailIdProceduresFininsh(
    idProcedure: number
  ): Observable<ProceduresCollection> {
    const urlComplete = `${environment.url}:${environment.port}/${environment.bpmOperation.value}/${environment.proExecution.value}/${idProcedure}`;

    return this.http.get<ProceduresCollection>(urlComplete);
  }
}
