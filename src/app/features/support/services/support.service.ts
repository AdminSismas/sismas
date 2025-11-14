/* eslint-disable @typescript-eslint/no-explicit-any */
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { supportData } from '../models/support.model';
// import { env, env2 } from 'src/environments/environments';
import { ModuloName } from '../models/modulos.model';
import { SupportLogs } from '../models/supportLogs.model';
import { env } from 'src/environments/environments.soporte';
import { SupportFormValues } from '../interfaces/form-values.interfaces';
@Injectable({
  providedIn: 'root'
})
export class SupportService {
  private readonly api_sql = ``;
  private readonly api_mddw = ``;
  private readonly api_mail = ``;

  // BehaviorSubject to hold and manage the current state
  private supportingSubject = new BehaviorSubject<supportData[]>([]);
  private supportingLogsSubject = new BehaviorSubject<SupportLogs[]>([]);
  //private apiTickets = 'https://tickets.cic-ware.com/api/v1/tickets';
  private apiTickets = `${env.url_base}${env.api}${env.module.soporte}`;
  supportLog$ = this.supportingLogsSubject.asObservable();
  support$ = this.supportingSubject.asObservable();
  supportLogs: SupportLogs[] = [];

  nombre = '';
  observacion = '';
  modulo = '';
  vista = '';

  constructor(private http: HttpClient) { }

  // insertTicket(formData: any): Observable<{ success: boolean; message: string; data?: any }> {
  //   const headers = new HttpHeaders({
  //     Authorization: 'AYR5gnSy5rIf8Y02H9RNnf28CVHYb1DnD8LaDYjkmG8bhc1Q-oATMSVF3WVTcWtl',
  //     'Content-Type': 'application/json',
  //   });

  //   const body = {
  //     title: formData.titulo,
  //     group: 'Administrativos',
  //     priority_id: 2,
  //     state: 'new',
  //     customer_id: 9,
  //     article: {
  //       subject: formData.asunto,
  //       body: formData.observacion,
  //       type: 'note',
  //       internal: false,
  //     },
  //   };

  //   return this.http.post<{ success: boolean; message: string; data?: any }>(
  //     this.apiTickets,
  //     body,
  //     { headers }
  //   ).pipe(
  //     map(response => {
  //       if (response.success) {
  //         return { success: true, message: 'Soporte creado', data: response.data };
  //       } else {
  //         return { success: false, message: response.message, data: null };
  //       }
  //     }),
  //     catchError(error => {
  //       return of({ success: false, message: error.message, data: null });
  //     })
  //   );
  // }

  insertTicket(formData: SupportFormValues): Observable<any> {
    const apiUrl = `${this.apiTickets}`;
    return this.http.post(apiUrl, formData);
  }

  getTickets(customerId: number): Observable<any> {
    const params = new HttpParams().set('customer_id', customerId.toString());
    return this.http.get<any>(`${this.apiTickets}`, { params });
  }


  createSupportRequest(request: supportData): Observable<{ success: boolean; message: string; data?: any }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<{ success: boolean; message: string; data?: any }>(
      `${this.api_mddw}?newSupport`,
       request,
       { headers })
       .pipe(
      map(response => {
        if (response.success) {
          return { success: true, message: 'Soporte creado', data: response.data };
        } else {
          return { success: false, message: response.message, data: null };
        }
      }),
      catchError(error => {
        return of({ success: false, message: error.message, data: null });
      })
    );
  }

  getSupportLogs(): Observable<{ success: boolean, message: string, data?: SupportLogs[] }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<{ success: boolean, message: string, data: any }>(
      `${this.api_mddw}?consultarSupportLogs`,
       { headers })
       .pipe(
      map(response => {
        if (response.success) {
          // Map the response to the StatusName type
          this.updateLogsInList(response.data);
          const supportlogs: SupportLogs[] = Array.isArray(response.data) ?
            response.data.map((item: any) => ({
              id: item.id,
              id_soporte: item.id_soporte,
              id_status: item.id_status,
              id_empleado: item.id_empleado,
              respuesta: item.respuesta,
              fecha_hora: item.fecha_hora
            })) : [];
          return { success: true, message: 'Logs de soporte encontrados', data: supportlogs };
        } else {
          return { success: false, message: 'No hay logs de soporte', data: [] };
        }
      }),
      catchError(error => {
        console.error('API error:', error);
        return of({ success: false, message: error.message, data: [] });
      })
    );
  }

  getModulos(): Observable<{ success: boolean, message: string, data?: ModuloName[] }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<{ success: boolean, message: string, data: any }>(
      `${this.api_sql}?getModulos`,
       { headers })
       .pipe(
      map(response => {
        if (response.success) {
          // Map the response to the StatusName type
          const moduloNames: ModuloName[] = Array.isArray(response.data) ?
            response.data.map((item: any) => ({
              id: item.id,
              modulo: item.modulo
            })) : [];
          return { success: true, message: 'Nombre de los módulos encontrados', data: moduloNames };
        } else {
          return { success: false, message: 'No hay nombres de módulos', data: [] };
        }
      }),
      catchError(error => {
        console.error('API error:', error);
        return of({ success: false, message: error.message, data: [] });
      })
    );
  }
  getVistas(id_modulo: number):
    Observable<{
       success: boolean; message: string; data?: any }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<{ success: boolean; message: string; data: any }>(`${this.api_sql}?getVistas=${id_modulo}`, { headers }).pipe(
      map(response => {
        if (response.success) {
          return { success: true, message: 'Vistas encontradas', data: response.data };
        } else {
          return { success: false, message: 'No hay Vistas', data: [] };
        }
      }),
      catchError(error => {
        console.error('API error:', error);
        return of({ success: false, message: error.message, data: [] });
      })
    );
  }

  sendEmail(vista_name: string, modulo_name: string, nombre: string, observacion: string): Observable<{
     success: boolean, message: string }> {
    const body = {
      vista_name,
      modulo_name,
      nombre,
      observacion
    };
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<{ success: boolean, message: string, data: any }>(`${this.api_mail}`, body, { headers }).pipe(
      map(response => {
        if (response.success) {
          return { success: true, message: 'Correo enviado correctamente' };
        } else {
          return { success: false, message: 'Error al enviar el correo' };
        }
      }),
      catchError(error => of({ success: false, message: error.message }))
    );
  }

  // Method to add a new record
addSupportData(newRecord: SupportLogs) {
  const currentData = this.supportingLogsSubject.value;

  // Prevent duplicates based on unique identifiers
  const updatedData = currentData.some((log) => log.id === newRecord.id)
    ? currentData
    : [...currentData, newRecord];

  this.supportingLogsSubject.next(updatedData);
}

   // Method to reset or update all records
   setSupportData(newData: SupportLogs[]) {
    this.supportingLogsSubject.next(newData); // Replace the entire dataset
  }

  private updateLogsInList(updatedLog: SupportLogs): void {
    const currentLogs = this.supportingLogsSubject.value;
    const index = currentLogs.findIndex(log => log.id === updatedLog.id);
    if (index > -1) {
      currentLogs[index] = updatedLog;
      this.supportingLogsSubject.next(currentLogs);
    }
  }
}
