import { Injectable, inject, signal } from '@angular/core';
import { catchError, Observable, EMPTY, throwError } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';
import { HttpParams, HttpClient } from '@angular/common/http';
import { environment } from '@environments/environments';
import { BpmTypeProcess } from '@features/bpm-workflows/models/bpm-type-process';

export interface PermissionVailable {
  executionId: string;
  message: string;
}

@Injectable({
  providedIn: 'root'
})
export class BpmProcessService {
  private http = inject(HttpClient);

  basic_url = `${environment.url}:${environment.port}${environment.bpmProcess.value}`;

  // Modernized with signal instead of BehaviorSubject
  private subjectPermision$ = signal<PermissionVailable>({ executionId: '', message: '' });
  dataPermissions$ = toObservable(this.subjectPermision$);

  getProceduresByCategory(category: string): Observable<BpmTypeProcess[]> {
    const url = `${this.basic_url}${environment.bpmProcess.category}`;
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('category', `${category}`);
    return this.http.get<BpmTypeProcess[]>(url, { params: paramsR  })
      .pipe(catchError(error => (error.status === 404 ? EMPTY : throwError(() => error))));
  }

  getListDocumentsByProcessId(processId: string): Observable<string[]> {
    const url = `${this.basic_url}${environment.bpmProcess.prodocumentStr}${processId}`;
    return this.http.get<string[]>(url)
      .pipe(catchError(error => (error.status === 404 ? EMPTY : throwError(() => error))));
  }

  setPermissions(data: PermissionVailable): void {
    this.subjectPermision$.set(data);
  }
}
