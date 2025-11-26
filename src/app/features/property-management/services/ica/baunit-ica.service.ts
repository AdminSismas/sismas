import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable } from 'rxjs';
import { IcaResponse } from '@shared/interfaces';
import { environment as envi } from '@environments/environments';

@Injectable({
  providedIn: 'root'
})
export class BaunitIcaService {
  /* ---- Properties ---- */
  private readonly basicUrl = `${envi.url}:${envi.port}`;

  /* ---- Injects ---- */
  http = inject(HttpClient);

  getBaunitIcaList(baunitId: string): Observable<IcaResponse[]> {
    const url = `${this.basicUrl}${envi.ica.value}${envi.ica.baunitId}/${baunitId}`;

    return this.http.get<IcaResponse[]>(url);
  }

  getBaunitIcaDetail(icaId: number): Observable<IcaResponse> {
    const url = `${this.basicUrl}${envi.ica.value}/${icaId}`;

    return this.http.get<IcaResponse>(url);
  }

  getBaunitIcaPhotos(
    baunitId: string,
    municipality: string,
    icaId: string
  ): Observable<string[]> {
    const { value, baunit } = envi.bpmAttachment;
    const url = `${this.basicUrl}${value}${baunit}/${baunitId}/photos`;

    const params = new HttpParams()
      .set('municipioId', municipality)
      .set('icaId', icaId);

    return this.http.get<string[]>(url, { params }).pipe(catchError(() => []));
  }
}
