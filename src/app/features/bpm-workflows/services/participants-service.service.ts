import { inject, Injectable, signal } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { toObservable } from '@angular/core/rxjs-interop';

import { environment as envi } from 'src/environments/environments';
import { PageSearchData } from '@shared/interfaces';
import { InformationPegeable } from '@shared/interfaces';
import { ProcessParticipant } from '@shared/interfaces';
import { GovernmentalChannel } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ParticipantsService {
  private url_basic = `${envi.url}:${envi.port}`;

  private chargeInfoSubject = signal<boolean | null>(false);
  
  chargeInfoSubject$ = toObservable(this.chargeInfoSubject);

  private http = inject(HttpClient);

  changeInfoParticipants(value: boolean | null) {
    this.chargeInfoSubject.set(value);
  }

  getAllParticipants(
    page: PageSearchData,
    executionId: string
  ): Observable<InformationPegeable> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', `${page.page}`);
    paramsR = paramsR.append('size', `${page.size}`);

    return this.getData<InformationPegeable>(
      `${this.url_basic}${envi.bpmParticipation.value}${envi.bpmParticipation.participation}/${executionId}`,
      paramsR
    );
  }

  getExistThirdPartyAffected(executionId: string): Observable<boolean> {
    return this.getAllThirdPartyAffected(executionId).pipe(
      map((result: ProcessParticipant[]) => result != null && result.length > 0)
    );
  }

  getAllThirdPartyAffected(
    executionId: string
  ): Observable<ProcessParticipant[]> {
    const url = `${this.url_basic}${envi.bpmParticipation.value}${envi.bpmParticipation.thirdPartyAffected}/${executionId}`;

    return this.http.get<ProcessParticipant[]>(url);
  }

  saveParticipantByExecutionId(
    executionId: string,
    body: ProcessParticipant
  ): Observable<ProcessParticipant> {
    return this.http.post<any>(
      `${this.url_basic}${envi.bpmParticipation.value}${envi.bpmParticipation.participation}${executionId}`, body
    );
  }

  updateParticipantByExecutionId(
    executionId: string,
    body: ProcessParticipant
  ): Observable<ProcessParticipant> {
    return this.http.put<any>(
      `${this.url_basic}${envi.bpmParticipation.value}${envi.bpmParticipation.participation}${executionId}`, body
    );
  }

  updateGovernmentalChannelCitedParticipantByExecutionId(
    executionId: string,
    body: GovernmentalChannel,
    participationId: number | string
  ): Observable<void> {
    return this.http.put<any>(
      `${this.url_basic}${envi.bpmParticipation.value}${envi.bpmParticipation.guv}/${executionId}${envi.typeNotification.cited}/${participationId}`, body
    );
  }

  updateGovernmentalChannelNotifiedParticipantByExecutionId(
    executionId: string,
    body: GovernmentalChannel,
    participationId: number | string
  ): Observable<void> {
    return this.http.put<any>(
      `${this.url_basic}${envi.bpmParticipation.value}${envi.bpmParticipation.guv}/${executionId}${envi.typeNotification.notified}/${participationId}`, body
    );
  }

  deleteParticipantByExecutionId(
    executionId: string,
    participationId: string
  ): Observable<void> {
    return this.http.delete<any>(
      `${this.url_basic}${envi.bpmParticipation.value}${envi.bpmParticipation.participation}${executionId}/${participationId}`
    );
  }

  private getData<T>(url: string, params: HttpParams): Observable<T> {
    return this.http.get<T>(url, { params: params });
  }

  getAutoThirdPartyAffected(
    executionId: string
  ): Observable<ProcessParticipant[]> {
    const url = `${this.url_basic}${envi.bpmParticipation.value}${envi.actualizarTercerosAfectados}/${executionId}`;

    return this.http.get<ProcessParticipant[]>(url);
  }
}
