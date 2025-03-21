import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment as envi } from 'src/environments/environments';
import { Reconocimiento, ReconocimientoPredial, ReconocimientoPredialMapper } from '../../interfaces/bpm/visita.interface';

@Injectable({
  providedIn: 'root'
})
export class VisitaService {
  private readonly base_url = `${envi.url}:${envi.port}${envi.ccReconocimientoPredial}`;

  private http = inject(HttpClient);

  createReconocimientoPredial(
    executionId: string | number,
    formValues: {
      description: string,
      docAportados: string,
      docCatastrales: string,
      observaciones: string
    }
  ): Observable<ReconocimientoPredial> {
    const body = { executionId, ...formValues };

    return this.http.post<Reconocimiento>(this.base_url, body)
      .pipe(
        map((response: Reconocimiento) =>  ReconocimientoPredialMapper.mapReconocimiento(response))
      );
  }
}
