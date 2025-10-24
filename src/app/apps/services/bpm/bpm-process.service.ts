import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, Observable , EMPTY, throwError } from 'rxjs';
import { HttpParams , HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { environment } from '../../../../environments/environments';
import { BpmTypeProcess } from '@shared/interfaces';

export interface PermissionVailable {
  executionId: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class BpmProcessService {
  basic_url = `${environment.url}:${environment.port}${environment.bpmProcess.value}`;

    subjectPermision$: BehaviorSubject<PermissionVailable> = new BehaviorSubject<PermissionVailable>({ executionId: '', message: '' });
    dataPermissions$: Observable<PermissionVailable> = this.subjectPermision$.asObservable();

  constructor(
  ) {
  }

  getProceduresByCategory(category: string): Observable<BpmTypeProcess[]> {
    const url = `${this.basic_url}${environment.bpmProcess.category}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('category', `${category}`);
    return this.http.get<any>(url, { params: paramsR  })
      .pipe(catchError(error => (error.status === 404 ? EMPTY : throwError(() => error))));
  }

  getListDocumentsByProcessId(processId: string): Observable<string[]> {
    const url = `${this.basic_url}${environment.bpmProcess.prodocumentStr}${processId}`;
    return this.http.get<any>(url)
      .pipe(catchError(error => (error.status === 404 ? EMPTY : throwError(() => error))));
  }

  setPermissions(data: PermissionVailable): void {
    this.subjectPermision$.next(data);
  }
}
