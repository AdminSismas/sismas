import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { DataFolio } from 'src/app/apps/interfaces/information-property/snr-folio-info';
import { environment as env } from 'src/environments/environments';
import { DataSource } from '@shared/interfaces';
import { DataPerson } from '@shared/interfaces';


@Injectable({
providedIn: 'root'
})
export class SnrService {
    private base_url = `${env.url}:${env.port}${env.snr}`;

    constructor(
        private http: HttpClient
    ) { }

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
