import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, of } from 'rxjs';
import { assistantData } from 'src/app/core/crud/assistantsData.model';
import { catchError, map } from 'rxjs/operators';
import { env } from '../../../../../../../environments/enviromentsIA';



@Injectable({
  providedIn: 'root'
})
export class ContactsParamsService {
  private apiAgente = `${env.url_base}${env.api}${env.module.agenteAPI}`;
  private readonly api_sql = `${env.url_base}${env.api}${env.api_end}`;

  constructor(private http: HttpClient) { }

  // Método para enviar los datos del formulario de archivo al backend
  sendFileData(formData: FormData): Observable<any> {
    return this.http.post(this.apiAgente, formData);
  }

  // Método para obtener los modelos desde la nueva URL
  getModelos(): Observable<any> {
    return this.http.get(`${this.api_sql}?modelos`);  // Asegúrate de que el endpoint sea correcto
  }

  // Método para obtener los modelos de voces desde la API
  getVoces(): Observable<any> {
    return this.http.get(`${this.api_sql}?voces`);  // Realiza la consulta GET con el indicador "voces"
  }

  // generateAsistants(generateAsistant: assistantData): Observable<{ success: boolean; message: string; data?: any }> {
  //   const headers = new HttpHeaders().set('Content-Type', 'application/json');
  //   return this.http.post<{ success: boolean; message: string; data?: any }>(`${this.api_sql}?generateAsistants`,generateAsistant,{ headers }).pipe(
  //     map(response => {
  //       if (response.success) {
  //         return { success: true, message: 'Creado exitosamente', data: response.data };
  //       } else {
  //         return { success: false, message: response.message, data: null };
  //       }
  //     }),
  //     catchError(error => {
  //       console.error('API error:', error);
  //       return of({ success: false, message: error.message, data: null });
  //     })
  //   );
  // }
}
