/* eslint-disable @typescript-eslint/no-explicit-any */
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, catchError, map, Observable, of } from 'rxjs';
// import { env } from 'src/environments/environments';
import { SupportLogs } from '../../models/supportLogs.model';
import { ObservationsData } from '../../models/observations.model';
import { StatusData } from '../../models/status.model';

@Injectable({
  providedIn: 'root'
})
export class SupportLogsService {

  private readonly api_sql = ``;
  private readonly api_mddw = 'https://dev.api.cic-ware.com/api-1/api.php';

  private supportLogsSubject = new BehaviorSubject<SupportLogs[]>([]);
  private observationsSupportSubject = new BehaviorSubject<ObservationsData[]>([]);
  private statusSupportSubject = new BehaviorSubject<StatusData[]>([]);
  public supportLogs$ = this.supportLogsSubject.asObservable();
  public observationsSupport$ = this.observationsSupportSubject.asObservable();
  public statusesSupport$ = this.statusSupportSubject.asObservable();

  constructor(private http: HttpClient) { }

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

addLog(log: SupportLogs) {
  const currentLogs = this.supportLogsSubject.value;
  this.supportLogsSubject.next([...currentLogs, log]);
}
getObservationsSupport(): Observable<{ success: boolean, message: string, data?: ObservationsData[] }> {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.get<{ success: boolean, message: string, data: any }>(
    `${this.api_mddw}?getObservaciones`,
      { headers })
      .pipe(
    map(response => {
      if (response.success) {
        // Map the response to the StatusName type
        const observaciones: ObservationsData[] = Array.isArray(response.data) ?
          response.data.map((item: any) => ({
            id: item.id,
            observacion: item.observacion,
            fecha_hora: item.fecha_hora
          })) : [];
        return { success: true, message: 'Observaciones de soporte encontrados', data: observaciones };
      } else {
        return { success: false, message: 'No hay observaciones de soporte', data: [] };
      }
    }),
    catchError(error => {
      console.error('API error:', error);
      return of({ success: false, message: error.message, data: [] });
    })
  );
}

updateRespuesta(
  id: number,
  respuesta: string
): Observable<{ success: boolean; message: string; data?: SupportLogs }> {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  const payload = { respuesta };

  return this.http
    .put<{ success: boolean; message: string; data: SupportLogs }>(
      `${this.api_sql}?updateRespuesta=${id}`, // Changed to RESTful route for clarity
      payload,
      { headers }
    )
    .pipe(
      map(response => {

        if (response.success && response.data) {
          // Call the update method to reflect changes in the list
          this.updateRespuestaInList(response.data);
          return {
            success: true,
            message: 'Campo respuesta actualizado correctamente',
            data: response.data,
          };
        } else {
          return {
            success: false,
            message: 'Error al actualizar el campo respuesta',
            data: undefined,
          };
        }
      }),
      catchError(() => {
        return of({
          success: false,
          message: 'Ocurrió un error al actualizar la respuesta',
        });
      })
    );
}

private updateRespuestaInList(updatedLog: SupportLogs): void {
  const currentRespuestaLogs = this.supportLogsSubject.value;
  const index = currentRespuestaLogs.findIndex(log => log.id === updatedLog.id);
  if (index > -1) {
    currentRespuestaLogs[index] = updatedLog;
    this.supportLogsSubject.next(currentRespuestaLogs);
  }
}

private updateLogsInList(updatedLog: SupportLogs): void {
  const currentLogs = this.supportLogsSubject.value;
  const index = currentLogs.findIndex(log => log.id === updatedLog.id);
  if (index > -1) {
    currentLogs[index] = updatedLog;
    this.supportLogsSubject.next(currentLogs);
  }
}

getStatuses(): Observable<{ success: boolean, message: string, data?: StatusData[] }> {
  const headers = new HttpHeaders().set('Content-Type', 'application/json');
  return this.http.get<{ success: boolean, message: string, data: any }>(
    `${this.api_sql}?consultarStatuses`, // Update the API endpoint accordingly
    { headers }
  ).pipe(
    map(response => {
      if (response.success) {
        // Map the response to the StatusData type
        const statuses: StatusData[] = Array.isArray(response.data) ?
          response.data.map((item: any) => ({
            id: item.id,
            status: item.status
          })) : [];
        return { success: true, message: 'Estados encontrados', data: statuses };
      } else {
        return { success: false, message: 'No hay estados disponibles', data: [] };
      }
    }),
    catchError(error => {
      console.error('API error:', error);
      return of({ success: false, message: error.message, data: [] });
    })
  );
}
}
