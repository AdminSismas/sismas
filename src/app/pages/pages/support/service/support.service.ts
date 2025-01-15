import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
import { supportData } from '../model/support.model';
// import { env, env2 } from 'src/environments/environments';
import { ModuloName } from '../model/modulos.model';
import { SupportLogs } from '../support_logs/model/supportLogs.model';
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
  supportLog$ = this.supportingLogsSubject.asObservable();
  support$ = this.supportingSubject.asObservable();
  supportLogs: SupportLogs[] = [];

  nombre: string = '';
  observacion: string = '';
  modulo: string = '';
  vista: string = '';

  constructor(private http: HttpClient) { }

  createSupportRequest(request: supportData): Observable<{ success: boolean; message: string; data?: any }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<{ success: boolean; message: string; data?: any }>(
      `${this.api_mddw}?newSupport`,
       request, 
       { headers })
       .pipe(
      map(response => {
        if (response.success) {
          console.log('API_RESPONSE_supportcreated:', response.data);
          return { success: true, message: 'Soporte creado', data: response.data };
        } else {
          console.log('API_RESPONSE_support_notcreated:', response.data);
          return { success: false, message: response.message, data: null };
        }
      }),
      catchError(error => {
        console.error('API error:', error);
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
            console.log(response.data);
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
          console.log('API_RESPONSE: OKAY', response.data);
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
    console.log('API_REQUEST_BODY:', body);
    return this.http.post<{ success: boolean, message: string, data: any }>(`${this.api_mail}`, body, { headers }).pipe(
      map(response => {
        if (response.success) {
          console.log('API_REQUEST_RESPONSE:', response.data);
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