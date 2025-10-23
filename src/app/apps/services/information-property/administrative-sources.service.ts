import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment as env } from 'src/environments/environments';
import { AdministrativeSource, CreateAdministrativeSourceParams, DeleteAdministrativeSourceParams, UpdateAdministrativeSource } from '@shared/interfaces';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministrativeSourcesService {
  private base_url = `${env.url}:${env.port}${env.administrativeSource}`;

  constructor(
    private http: HttpClient
  ) { }

  /* GET */

  getAdministrativeSourcesMain(baunitId: string): Observable<AdministrativeSource[]> {
    const url = `${this.base_url}main/${baunitId}`;
    return this.http.get<AdministrativeSource[]>(url)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }

  getAdministrativeSourcesTemp(baunitId: string, executionId: string): Observable<AdministrativeSource[]> {
    const url = `${this.base_url}temp/${executionId}/${baunitId}`;

    return this.http.get<AdministrativeSource[]>(url)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }

  getAdministrativeSourcesHist(baunitId: string, executionId: string): Observable<AdministrativeSource[]> {
    const url = `${this.base_url}hist/${executionId}/${baunitId}`;

    return this.http.get<AdministrativeSource[]>(url)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }

  getAdministrativeSourceById(params: { id: number, baunitId: string, executionId: string }): Observable<AdministrativeSource> {
    const { id, baunitId, executionId } = params;
    const url = `${this.base_url}temp/${executionId}/${baunitId}/${id}`;

    return this.http.get<AdministrativeSource>(url)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }

  /* POST */

  createAdministrativeSource(params: CreateAdministrativeSourceParams): Observable<AdministrativeSource> {
    const { executionId, baunitId, administrativeSource } = params;
    const url = `${this.base_url}temp/${executionId}/${baunitId}`;

    return this.http.post<AdministrativeSource>(url, administrativeSource)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }

  /* PUT */
  updateAdministrativeSource(parameters: UpdateAdministrativeSource): Observable<AdministrativeSource> {
    const { baunitId, executionId, params } = parameters;
    const url = `${this.base_url}temp/${executionId}/${baunitId}`;

    return this.http.put<AdministrativeSource>(url, params)
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }

  /* DELETE */

  deleteAdministrativeSource(params: DeleteAdministrativeSourceParams): Observable<void> {
    const { baunitId, changeLogId, fuenteAdminId } = params;
    const url = this.base_url.slice(0, -1);

    const formData = new FormData();
    formData.append('changeLogId', changeLogId);
    formData.append('fuenteAdminId', fuenteAdminId);
    formData.append('baunitId', baunitId);

    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });

    return this.http.delete<void>(url, {
      headers,
      body: formData
    })
      .pipe(
        catchError(error => {
          throw error;
        })
      );
  }
}
