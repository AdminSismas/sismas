import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { catchError, Observable, throwError } from 'rxjs';
import { DataFolio, DataPerson, DataSource } from '@features/property-management/models';
import { environment as env } from '@environments/environments';

@Injectable({
  providedIn: 'root'
})
export class SnrService {
  private http = inject(HttpClient);
  private base_url = `${env.url}:${env.port}${env.snr}`;

    /* GET */
    getFolioByOripAndFmi(fmi: string, orip: string): Observable<DataFolio> {
        const url = `${this.base_url}/folio?orip=${orip}&fmi=${fmi}`;

        return this.http.get<DataFolio>(url).pipe(
            catchError(error => {
                console.error('Error al obtener la información de folio:', error);
                return throwError(() => error); // Ajuste para TypeScript estricto
            })
        );
    }

    getSourceByOripAndFmi(fmi: string, orip: string): Observable<DataSource[]> {
        const url = `${this.base_url}/fuente?orip=${orip}&fmi=${fmi}`;

        return this.http.get<DataSource[]>(url).pipe(
            catchError(error => {
                return throwError(() => error); // Ajuste para TypeScript estricto
            })
        );
    }

    getPersonByOripAndFmi(fmi: string, orip: string, anotacion: string): Observable<DataPerson[]> {
        const url = `${this.base_url}/persona`;

        const params = new HttpParams()
          .set('orip', orip)
          .set('fmi', fmi)
          .set('anotacion', anotacion);

        return this.http.get<DataPerson[]>(url, { params }).pipe(
            catchError(error => {
                console.error('Error al obtener la información de Persona:', error);
                return throwError(() => error); // Ajuste para TypeScript estricto
            })
        );
    }
}
