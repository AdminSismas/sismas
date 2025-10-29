import { HttpClient, HttpHeaders } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment as envi } from '@environments/environments';

import { ProcedureStateResponse } from '../interfaces';
import { SendRequestProcedureData } from 'src/app/apps/interfaces/document-management/view-certificate-management-data.interface';

interface ProcedureQueryResponse {
  requestId: string;
  status: string;
  paymentReference: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProcedureStateTableService {
  /* ---- Properties ---- */
  baseUrl = `${envi.url}:${envi.port}${envi.serviciosTaquilla.value}${envi.serviciosTaquilla.solicitud}`;

  /* ---- Injects ---- */
  private http = inject(HttpClient);

  /* ---- Methods ---- */
  getProcedureStateList(): Observable<ProcedureStateResponse[]> {
    return this.http.get<ProcedureStateResponse[]>(this.baseUrl);
  }

  sendRequestProcedure(
    file: File,
    data: SendRequestProcedureData
  ): Observable<ProcedureQueryResponse> {
    const formData = new FormData();

    const dataBloc = new Blob([JSON.stringify(data)], {
      type: 'application/json'
    });

    formData.append('data', dataBloc);
    formData.set('file', file);

    const headers = new HttpHeaders({
      Accept: '*/*',
      'Accept-Encoding': 'gzip, deflate, br',
      Connection: 'keep-alive'
    });

    return this.http.post<ProcedureQueryResponse>(this.baseUrl, formData, {
      headers
    });
  }

  viewProcedureFile(id: string): Observable<Blob> {
    const url = `${this.baseUrl}/${id}${envi.serviciosTaquilla.download}`;

    return this.http.get(url, { responseType: 'blob' });
  }
}
