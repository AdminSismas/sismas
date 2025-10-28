import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as envi } from 'src/environments/environments';

const basic_url = `${envi.url}:${envi.port}${envi.bpmResolution.value}`;

@Injectable({
  providedIn: 'root'
})
export class ResService {
  private http = inject(HttpClient);

  getResValidateDoc(executionId: string): Observable<Blob> {
    const url = `${basic_url}${envi.preview}/${executionId}`;

    return this.http.get(url, {
      responseType: 'blob'
    });
  }

  getNoProcedeDoc(executionId: string): Observable<Blob> {
    const url = `${basic_url}${envi.noprocede}/${executionId}`;

    return this.http.get(url, {
      responseType: 'blob'
    });
  }

}
