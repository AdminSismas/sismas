import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environments';
import { PageProceduresData, ProceduresCollection } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ProcedureWorkFinishedService {
  private readonly http = inject(HttpClient);

  private readonly basic_url = `${environment.url}:${environment.port}${environment.bpmOperation.value}${environment.proExecution.value}`;

  /* -------------- MÉTODOS -------------- */
  getDataPropertyByWorkFinishedProcedures(
    page: PageProceduresData
  ): Observable<ProceduresCollection[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('page', `${page.page}`);
    params = params.append('size', `${page.size}`);
    params = params.append('beginAt', `${page.beginAt}`);
    params = params.append('beginAtE', `${page.beginAtE}`);
    params = params.append('executionCode', `${page.executionCode}`);
    params = params.append('individualNumber', `${page.individualNumber}`);
    // '{{url}}:{{port}}/bpmOperation/proExecution/finished?page=0&size=10&beginAt=05/01/2024&beginAtE=&executionCode=0&individualNumber='
    return this.http.get<ProceduresCollection[]>(
      `${this.basic_url}${environment.active}`,
      {
        params
      }
    );
  }

  public getFilterTableProcedureService(
    page: PageProceduresData
  ): Observable<ProceduresCollection[]> {
    const params: HttpParams = new HttpParams()
      .append('page', `${page.page}`)
      .append('size', `${page.size}`)
      .append('beginAt', `${page.beginAt}`)
      .append('beginAtE', `${page.beginAtE}`)
      .append('executionCode', `${page.executionCode}`)
      .append('individualNumber', `${page.individualNumber}`);
    const urlComplete = `${this.basic_url}${environment.finished}`;

    return this.http.get<ProceduresCollection[]>(urlComplete, {
      params
    });
  }

  public viewDetailIdProceduresFininsh(
    idProcedure: number
  ): Observable<ProceduresCollection> {
    const urlComplete = `${this.basic_url}/${idProcedure}`;

    return this.http.get<ProceduresCollection>(urlComplete);
  }
}
