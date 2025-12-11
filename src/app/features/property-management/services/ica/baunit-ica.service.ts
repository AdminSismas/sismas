import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IcaResponse } from '@shared/interfaces';
import { environment } from '@environments/environments';

@Injectable({
  providedIn: 'root'
})
export class BaunitIcaService {
  /* ---- Properties ---- */
  private readonly basicUrl = `${environment.url}:${environment.port}`;

  /* ---- Injects ---- */
  http = inject(HttpClient);

  getBaunitIcaList(baunitIdString: string): Observable<IcaResponse[]> {
    const { value: ica, baunitId } = environment.ica;
    const url = `${this.basicUrl}${ica}${baunitId}/${baunitIdString}`;

    return this.http.get<IcaResponse[]>(url);
  }

  getBaunitIcaDetail(icaId: number): Observable<IcaResponse> {
    const { value: ica } = environment.ica;
    const url = `${this.basicUrl}${ica}/${icaId}`;

    return this.http.get<IcaResponse>(url);
  }

  createBaunitIca(icaDetails: Partial<IcaResponse>): Observable<IcaResponse> {
    const { value: ica } = environment.ica;
    const url = `${this.basicUrl}${ica}`;

    return this.http.post<IcaResponse>(url, icaDetails);
  }

  updateBaunitIca(
    icaId: number,
    newIcaResponse: Partial<IcaResponse>
  ): Observable<IcaResponse> {
    const { value: ica } = environment.ica;
    const url = `${this.basicUrl}${ica}/${icaId}`;

    return this.http.patch<IcaResponse>(url, newIcaResponse);
  }

  deleteBaunitIca(icaId: number): Observable<void> {
    const { value: ica } = environment.ica;
    const url = `${this.basicUrl}${ica}/${icaId}`;

    return this.http.delete<void>(url);
  }
}
