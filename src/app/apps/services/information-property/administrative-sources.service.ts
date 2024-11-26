import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment as env } from 'src/environments/environments';
import { AdministrativeSource, CreateAdministrativeSourceParams } from '../../interfaces/information-property/administrative-source';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class AdministrativeSourcesService {
  private base_url = `${env.url}:${env.port}${env.administrativeSource}`

  constructor(
    private http: HttpClient
  ) { }

  getAdministrativeSourcesMain(baunitId: string): Observable<AdministrativeSource[]> {
    const url = `${this.base_url}main/${baunitId}`
    return this.http.get<AdministrativeSource[]>(url)
      .pipe(
        catchError(error => {
          console.log('Error al obtener la información de fuentes administrativas main')
          throw error
        })
      )
  }

  getAdministrativeSourcesTemp(baunitId: string, executionId: string): Observable<AdministrativeSource[]> {
    const url = `${this.base_url}temp/${executionId}/${baunitId}`

    return this.http.get<AdministrativeSource[]>(url)
      .pipe(
        catchError(error => {
          console.log('Error al obtener la información de fuentes administrativas temp')
          throw error
        })
      )
  }

  getAdministrativeSourceById(params: { id: number, baunitId: string, executionId: string }): Observable<AdministrativeSource> {
    const { id, baunitId, executionId } = params
    const url = `${this.base_url}temp/${executionId}/${baunitId}/${id}`

    return this.http.get<AdministrativeSource>(url)
      .pipe(
        catchError(error => {
          console.log('Error al obtener la información de fuentes administrativas')
          throw error
        })
      )
  }

  createAdministrativeSource(params: CreateAdministrativeSourceParams): Observable<AdministrativeSource> {
    const { executionId, baunitId, administrativeSource } = params
    const url = `${this.base_url}temp/${executionId}/${baunitId}`

    return this.http.post<AdministrativeSource>(url, administrativeSource)
      .pipe(
        catchError(error => {
          console.log('Error al crear la fuente administrativa')
          throw error
        })
      )
  }
}
