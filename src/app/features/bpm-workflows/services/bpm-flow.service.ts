import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment as envi } from 'src/environments/environments';
import { IBpmFlowService } from '@features/bpm-workflows/interfaces';
import { ProFlow } from '@features/bpm-workflows/interfaces';

@Injectable({
  providedIn: 'root'
})
export class BpmFlowService implements IBpmFlowService {
  private basic_url = `${envi.url}:${envi.port}${envi.bpmOperation.value}`;

  private http = inject(HttpClient);

  getProFlow(flowId: string): Observable<ProFlow> {
    const url = `${this.basic_url}/${envi.bpmOperation.proflow}${flowId}`;
    return this.http.get<ProFlow>(url).pipe(
      catchError(error => {
        console.error('Error getting pro flow:', error);
        throw error;
      })
    );
  }

  getProFlowProExecution(executionId: string): Observable<ProFlow> {
    const { proflow, proExecution } = envi.bpmOperation;
    const url = `${this.basic_url}/${proflow}${proExecution}${executionId}`;
    return this.http.get<ProFlow>(url).pipe(
      catchError(error => {
        console.error('Error getting pro flow execution:', error);
        throw error;
      })
    );
  }
}
