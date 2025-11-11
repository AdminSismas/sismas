import { inject, Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment as envi } from '@environments/environments';
import { IBpmTaskService } from '@features/bpm-workflows/interfaces';
import { ProTaskE } from '@features/tasks/models';

@Injectable({
  providedIn: 'root'
})
export class BpmTaskService implements IBpmTaskService {
  private basic_url = `${envi.url}:${envi.port}${envi.bpmOperation.value}`;

  private http = inject(HttpClient);

  getProTaskCountComment(id: string): Observable<number> {
    const url = `${this.basic_url}${envi.bpmOperation.comment}/${id}${envi.bpmOperation.count}`;
    return this.http.get<number>(url).pipe(
      catchError(error => {
        console.error('Error getting task comment count:', error);
        throw error;
      })
    );
  }

  getProTaskCountAttachment(id: string): Observable<number> {
    const basic_url = `${envi.url}:${envi.port}${envi.bpmAttachment.value}`;
    const url = `${basic_url}${envi.bpmAttachment.proExecution}${id}${envi.bpmAttachment.count}`;
    return this.http.get<number>(url).pipe(
      catchError(error => {
        console.error('Error getting task attachment count:', error);
        throw error;
      })
    );
  }

  getNextOperation(executionId: string, answer: boolean): Observable<ProTaskE> {
    const url = `${this.basic_url}${envi.bpmOperation.proExecution}${executionId}${envi.bpmOperation.next}`;
    return this.http.post<ProTaskE>(url, { answer }).pipe(
      catchError(error => {
        console.error('Error getting next operation:', error);
        throw error;
      })
    );
  }

  getPreviewOperation(executionId: string): Observable<ProTaskE> {
    const url = `${this.basic_url}${envi.bpmOperation.proExecution}${executionId}${envi.bpmOperation.prev}`;
    return this.http.post<ProTaskE>(url, {}).pipe(
      catchError(error => {
        console.error('Error getting preview operation:', error);
        throw error;
      })
    );
  }
}
