import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { catchError, Observable, of, switchMap, throwError } from 'rxjs';
import { DataFolio } from 'src/app/apps/interfaces/information-property/snr-folio-info';
import { environment as env } from 'src/environments/environments';
import { DataSource } from '../../interfaces/information-property/snr-source-info';
import { DataPerson } from '../../interfaces/information-property/snr-person-info';


@Injectable({
providedIn: 'root'
})
export class SnrService {
    private base_url = `${env.url}:${env.port}${env.snr}`;

    constructor(
        private http: HttpClient
    ) { }

    /* GET */
    getFolioByOripAndFmi(orip: string, fmi: string): Observable<DataFolio[]> {
        const url = `${this.base_url}/folio?orip=${orip}&fmi=${fmi}`;
        
        return this.http.get<DataFolio[]>(url).pipe(
            catchError(error => {
                console.error('Error al obtener la información de folio:', error);
                return throwError(() => error); // Ajuste para TypeScript estricto
            })
        );
    }

    getSourceByOripAndFmi(orip: string, fmi: string): Observable<DataSource[]> {
        const url = `${this.base_url}/fuente?orip=${orip}&fmi=${fmi}`;
        
        return this.http.get<DataSource[]>(url).pipe(
            catchError(error => {
                console.error('Error al obtener la información de Fuente:', error);
                return throwError(() => error); // Ajuste para TypeScript estricto
            })
        );
    }

    getPersonByOripAndFmi(orip: string, fmi: string): Observable<DataPerson[]> {
        const url = `${this.base_url}/persona?orip=${orip}&fmi=${fmi}`;
        
        return this.http.get<DataPerson[]>(url).pipe(
            catchError(error => {
                console.error('Error al obtener la información de Persona:', error);
                return throwError(() => error); // Ajuste para TypeScript estricto
            })
        );
    }
}
