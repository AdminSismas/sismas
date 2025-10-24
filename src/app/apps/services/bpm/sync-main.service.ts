import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '@shared/services';
import { Observable } from 'rxjs';
import { environment as envi } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SyncMainService {

  base_url = `${envi.url}:${envi.port}${envi.synchronization}`;

  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) { }

  synchronizeChanges(executionId: string, page = 0, size = 10): Observable<string> {
    let url = `${this.base_url}/${executionId}${envi.synchronize}`;

    url = `${url}?page=${page}&size=${size}`;

    return this.http.post<string>(url, {});
  }
}
