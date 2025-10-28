import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { catchError, Observable } from 'rxjs';

import { environment } from 'src/environments/environments';
import { PageSortByData } from '@shared/interfaces';
import { Proflow, WorkflowCollection } from '@shared/interfaces';
import { InformationPegeable } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class WorkflowService {
  private http = inject(HttpClient);

  /* -------------- ATRIBUTOS -------------- */
  basic_url = `${environment.url}:${environment.port}${environment.bpmProcess.value}`;

  /* -------------- MÉTODOS -------------- */
  getDataPropertyByWorkflow(
    page: PageSortByData
  ): Observable<InformationPegeable> {
    const url = `${this.basic_url}`;

    let paramsWF: HttpParams = new HttpParams();
    paramsWF = paramsWF.append('page', `${page.page}`);
    paramsWF = paramsWF.append('size', `${page.size}`);
    paramsWF = paramsWF.append('sortBy', `${page.sortBy}`);

    return this.http.get<InformationPegeable>(url, { params: paramsWF });
  }

  createWorkflow(params: WorkflowCollection): Observable<WorkflowCollection> {
    const url = `${this.basic_url}`;
    return this.http.post<WorkflowCollection>(url, params).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Hubo un error al crear el flujo de trabajo');
        throw error;
      })
    );
  }

  updateWorkflow(params: WorkflowCollection): Observable<WorkflowCollection> {
    const url = `${this.basic_url}/${params.processId}`;

    return this.http.put<WorkflowCollection>(url, params).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Hubo un error al actualizar el flujo de trabajo');
        throw error;
      })
    );
  }

  getTasksList(id: string): Observable<Proflow[]> {
    const url = `${this.basic_url}/${environment.bpmOperation.proflow}${id}`;

    return this.http.get<Proflow[]>(url).pipe(
      catchError((error: HttpErrorResponse) => {
        console.error('Hubo un error al obtener la lista de tareas');
        throw error;
      })
    );
  }

  getTaskById(id: string): Observable<Proflow> {
    const url = `${this.basic_url}/${environment.bpmOperation.proflow}${environment.bpmOperation.flow}${id}`;

    return this.http.get<Proflow>(url);
  }

  updateTask(id: string, body: Partial<Proflow>): Observable<Proflow> {
    const url = `${this.basic_url}/${environment.bpmOperation.proflow}${id}`;

    return this.http.put<Proflow>(url, body);
  }

  createTask(idProcess: string, body: Partial<Proflow>): Observable<Proflow> {
    const url = `${this.basic_url}/${environment.bpmOperation.proflow}${idProcess}`;

    return this.http.post<Proflow>(url, body);
  }

  getPreforms(): Observable<InformationPegeable> {
    const url = `${this.basic_url}/${environment.bpmOperation.preform}`;

    const params = new HttpParams()
      .set('page', '0')
      .set('size', '100')
      .set('sortBy', 'name');

    return this.http.get<InformationPegeable>(url, { params });
  }
}
