import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { assistantData } from './assistantsData.model';
import { env } from "@environments/enviromentsIA";


@Injectable({
  providedIn: 'root'
})
export class AssistantsService {
  private readonly api_sql = `${env.url_base}${env.api}${env.api_end}`;
  private baseUrl = 'https://fakestoreapi.com/products';


  private assistantsSubject = new BehaviorSubject<assistantData[]>([]);
  public assistants$ = this.assistantsSubject.asObservable();

  constructor(private http: HttpClient) { }

  listAssistant(idEmpresa: number): Observable<{ success: boolean, message: string, data?: assistantData[] }> {
    const body = { idEmpresa };
    return this.http.post<{ success: boolean, message: string, data: any }>(`${this.api_sql}?assistants`, body).pipe(
      map(response => {
        if (response.success) {
          const assistants: assistantData[] = Array.isArray(response.data) ? response.data.map((item: any) => ({
            id: item.id,
            idempresa: item.idempresa,
            empresa: item.empresa,
            id_asistente: item.id_asistente,
            nombre: item.nombre,
            descripcion: item.descripcion,
            instrucciones: item.instrucciones_assistan,
            instruccion_saludo_despedida: item.instrucciones_saludo_despedida,
            instruccion_personalidad: item.instrucciones_personalidad,
            modelo_predeterminado: item.modelo_predeterminado,
            modelo_actual: item.modelo_actual,
            cambiar_modelo: item.cambiar_modelo,
            openai: item.openai,
            anthropic: item.anthropic,
            google: item.google,
            llama: item.llama,
            cic: item.cic,
            escuchar: item.esuchar,
            hablar: item.hablar,
            archivos: item.archivos,
            codigo: item.codigo,
            tavily: item.tavily,
            wikipedia: item.wikipedia,
            pdf: item.pdf,
            bi: item.bi,
            video: item.video,
            imgurl: item.imgurl,
            id_voz: item.id_voz,
            status: item.status,
            id_modelo_voz: item.id_modelo_voz,
            similarity_boost: item.similarity_boost,
            stability: item.stability,
            style: item.style,
            use_speaker_boost: item.use_speaker_boost,
            optimize_streaming_latency: item.optimize_streaming_latency,
            nombre_voz: item.nombre_voz,
            id_eleven: item.id_eleven,
            ejemplo_voz: item.ejemplo_voz,
            empresa_modelo: item.empresa_modelo
          })) : [];
          this.assistantsSubject.next(assistants);
          return { success: true, message: 'Asistentes encontrados', data: assistants };
        } else {
          return { success: false, message: 'No hay asistentes', data: [] };
        }
      }),
      catchError(error => {
        console.error('API error:', error);
        return of({ success: false, message: error.message, data: [] });
      })
    );
  }

  public deleteAssistant(id: number): Observable<void> {
    return this.http.delete<void>(`${this.api_sql}?deleteAssistant=${id}`); // Asegúrate de que la URL y el endpoint sean correctos
  }

  public updateAssistant(id: number, assistant: assistantData): Observable<assistantData> {
    alert("update"+ id + JSON.stringify(assistant));
    return this.http.put<assistantData>(`${this.api_sql}?updateAssistant=${id}`, assistant); // Asegúrate de que la URL y el endpoint sean correctos
  }

  public newAssistant(assistant: assistantData): Observable<assistantData> {
    return this.http.post<assistantData>(`${this.api_sql}?newAssistant`, assistant); // Asegúrate de que la URL y el endpoint sean correctos
  }
}
