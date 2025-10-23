import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/* -------------- IMPORTACIONES ARCHIVOS LOCALES -------------- */
import { environment } from '../../../../environments/environments';

import { CommentsCollection } from '@shared/interfaces';
import { PageCommentsData } from '@shared/interfaces';
import { contentInfoComments } from '@shared/interfaces';
import { SendGeneralRequestsService } from '@shared/services';
import { InformationPegeable } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class CommentsService {
  /* -------------- ATRIBUTOS -------------- */
  basic_url = `${environment.url}:${environment.port}${environment.bpmOperation.value}${environment.bpmOperation.comment}/`;

  /* -------------- CONSTRUCTRO -------------- */
  constructor(
    private requestsService: SendGeneralRequestsService,
    private http: HttpClient
  ) {}

  /* -------------- MÉTODOS -------------- */
  getDataPropertyByComments(
    executionId: string,
    pegeData: PageCommentsData
  ): Observable<InformationPegeable> {
    const url = `${this.basic_url}${executionId}`;

    let params: HttpParams = new HttpParams();
    params = params.append('page', `${pegeData.NumPage}`);
    params = params.append('size', `${pegeData.NumSize}`);

    return this.http.get<InformationPegeable>(url, { params });
  }

  postDataPropertyByComments(executionId: string, body: contentInfoComments) {
    const url = `${this.basic_url}${executionId}`;
    return this.fetchBody(url, body);
  }

  deleteDataPropertyByComments(executionId: string, commentId: number) {
    const url = `${this.basic_url}${executionId}/${commentId}`;
    return this.deleteBody(url);
  }

  /* -------------- MÉTODOS PRIVADOS -------------- */
  private getData(url: string, params: any): Observable<CommentsCollection> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }

  private fetchBody(url: string, body: any): Observable<CommentsCollection> {
    return this.requestsService.sendRequestsFetchPostBody(url, body);
  }

  private deleteBody(url: string): Observable<CommentsCollection> {
    return this.requestsService.sendDeleteFetch(url);
  }
}
