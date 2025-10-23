import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { IcaResponse } from '@shared/components';
import { environment as envi } from 'src/environments/environments';

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
}
