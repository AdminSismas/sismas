import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { environment as envi } from 'src/environments/environments';
import { Reconocimiento, ReconocimientoPredial, ReconocimientoPredialMapper, TagsReconocimiento } from '../../interfaces/bpm/visita.interface';

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

  getTags(executionId: string | number): Observable<TagsReconocimiento> {
    const url = `${this.base_url}${envi.getByExecution}/${executionId}`;

    return this.http.get<Reconocimiento>(url)
      .pipe(
        map((response: Reconocimiento) =>  ReconocimientoPredialMapper.mapReconocimientoTags(response))
      );
  }

  sendTags(
    executionId: string | number,
    formValues: {
      tag01: string,
      tag02: string,
      tag03: string,
      tag04: string,
      tag05: string
    }
  ): Observable<ReconocimientoPredial> {
    const body = { executionId, ...formValues };

    return this.http.post<ReconocimientoPredial>(this.base_url, body);
  }
}
