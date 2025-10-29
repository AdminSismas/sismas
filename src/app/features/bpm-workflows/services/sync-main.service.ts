import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as envi } from '@environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SyncMainService {

  base_url = `${envi.url}:${envi.port}${envi.synchronization}`;

  private http = inject(HttpClient);

  synchronizeChanges(executionId: string, page = 0, size = 10): Observable<string> {
    let url = `${this.base_url}/${executionId}${envi.synchronize}`;

    url = `${url}?page=${page}&size=${size}`;

    return this.http.post<string>(url, {});
  }
}
