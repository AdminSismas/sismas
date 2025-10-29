import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment as envi } from '@environments/environments';
import { Requirement } from '../interfaces/requirements.interface';
import { Observable } from 'rxjs';
import { PayloadCompleteDocs } from '../interfaces/payload-complete-docs.interface';

const baseUrl = `${envi.url}:${envi.port}${envi.bpmResolution.value}`;

@Injectable({
  providedIn: 'root'
})
export class CompleteDocsService {
  private http = inject(HttpClient);

  getRequirements(executionId: string): Observable<Requirement[]> {
    const { requirements } = envi.bpmResolution;
    const url = `${baseUrl}${requirements}/${executionId}`;

    return this.http.get<Requirement[]>(url);
  }

  getCompleteDocs(executionId: string, payload: PayloadCompleteDocs) {
    const { completeDocs } = envi.bpmResolution;
    const url = `${baseUrl}${completeDocs}/${executionId}`;

    return this.http.post(url, payload, { responseType: 'blob' });
  }

  getFinalDocs(executionId: string) {

    // {{url}}:{{port}}/bpmResolution/finalDocs/{{executionId}}
    const { finalDocs } = envi.bpmResolution;
    const url = `${baseUrl}${finalDocs}/${executionId}`;

    return this.http.get(url, { responseType: 'blob' });
  }
}

