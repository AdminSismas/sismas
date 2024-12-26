import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as envi } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SyncMainService {

  base_url: string = `${envi.url}:${envi.port}${envi.synchronization}`;

  constructor(
    private http: HttpClient
  ) { }

  synchronizeChanges(executionId: string, page: number = 0, size: number = 10): Observable<string> {
    let url: string = `${this.base_url}/${executionId}${envi.synchronize}`;

    url = `${url}?page=${page}&size=${size}`;

    return this.http.post<string>(url, {});
  }
}
