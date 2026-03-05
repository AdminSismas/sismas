import { environment as envi } from '@environments/environments';
import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';

const basic_url = `${envi.url}:${envi.port}${envi.bpmParticipation.value}`;

export enum GuvStateType {
  Citacion = 'Citacion',
  Citado = 'Citado',
  Notificado = 'Notificado',
  FijarAviso = 'Fijar Aviso'
}

@Injectable({
  providedIn: 'root'
})
export class CitationNoticeService {
  http = inject(HttpClient);

  executePrint(
    participationId: string,
    guvStateType: GuvStateType
  ): Observable<Blob> {
    let url = `${basic_url}/${participationId}`;
    switch (guvStateType) {
      case GuvStateType.Citado:
        url += envi.generateCitacion;
        break;
      case GuvStateType.Notificado:
        url += envi.generateNotificacion;
        break;
    }

    return this.http.get(url, { responseType: 'blob' });
  }
}
