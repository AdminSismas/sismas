import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { assistantData } from 'src/app/core/crud/assistantsData.model';
import { env } from "@environments/enviromentsIA";

@Injectable({
  providedIn: 'root'
})
export class ComponentsServicesService {
  newAssistant(assistantData: any) {
    throw new Error('Method not implemented.');
  }
  private readonly api_sql = `${env.url_base}${env.api}${env.api_end}`;
  public assistantSubject = new BehaviorSubject<assistantData[]>([]);
  public assistant$ = this.assistantSubject.asObservable();

  constructor(private http: HttpClient) { }


  // Método para agregar un nuevo asistente a la lista de BehaviorSubject
  private addAssistantToList(assistant: assistantData) {
    const currentAssistants = this.assistantSubject.value;
    this.assistantSubject.next([...currentAssistants, assistant]);
  }

  loadAssistants(): Observable<{ success: boolean; message: string; data: assistantData[] }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<{ success: boolean; message: string; data: assistantData[] }>(`${this.api_sql}?listAssistants`, { headers }).pipe(
      map(response => {
        if (response.success && response.data) {
          this.assistantSubject.next(response.data);
          return { success: true, message: 'Asistentes cargados correctamente', data: response.data };
        } else {
          console.error('Error al cargar los asistentes:', response);
          return { success: false, message: 'Error al cargar los asistentes', data: [] };
        }
      }),
      catchError(error => {
        console.error('API error:', error);
        return of({ success: false, message: error.message, data: [] });
      })
    );
  }

  // Método para actualizar un asistente, puede manejar tanto FormData como assistantData
  updateAssistant(id: number, data: FormData | assistantData): Observable<{ success: boolean; message: string; data: assistantData | null }> {
    // Aquí no es necesario establecer el 'Content-Type' cuando se usa FormData
    const headers = !(data instanceof FormData) ? new HttpHeaders().set('Content-Type', 'application/json') : undefined;

    return this.http.put<{ success: boolean; message: string; data: assistantData | null }>(`${this.api_sql}?updateAssistant=${id}`, data, { headers }).pipe(
      map(response => {
        if (response.success && response.data) {
          return { success: true, message: 'Asistente actualizado', data: response.data };
        } else {
          return { success: false, message: 'Error al actualizar el asistente', data: null };
        }
      }),
      catchError(error => {
        return of({ success: false, message: error.message, data: null });
      })
    );
  }

  updateParam(id: number, data: any,  updateType: string): Observable<{ success: boolean; message: string; data: assistantData | null }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    const payload = {...data, updateType};

    return this.http.put<{ success: boolean; message: string; data: assistantData | null }>(`${this.api_sql}?updateparam=${id}`, payload, { headers }).pipe(
      map(response => {
        if (response.success && response.data) {
          this.updateAssistantInList(response.data);
          return { success: true, message: 'Parámetros actualizados', data: response.data };
        } else {
          console.error('Error al actualizar los parámetros:', response);
          return { success: false, message: 'Error al actualizar los parámetros', data: null };
        }
      }),
      catchError(error => {
        console.error('API error:', error);
        return of({ success: false, message: error.message, data: null });
      })
    );
  }

  public updateAssistantInList(assistant: assistantData) {
    const currentAssistants = this.assistantSubject.value;
    const index = currentAssistants.findIndex(a => a.id === assistant.id);
    if (index > -1) {
      currentAssistants[index] = assistant;
      this.assistantSubject.next(currentAssistants);
    }
  }

  createIntructions(data: FormData | assistantData): Observable<{ success: boolean; message: string; data?: any }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<{ success: boolean; message: string; data?: any }>(`${this.api_sql}?createIntructions`,data,{ headers }).pipe(
      map(response => {
        if (response.success) {
          return { success: true, message: 'Instrucciones creadas exitosamente', data: response.data };
        } else {
          return { success: false, message: response.message, data: null };
        }
      }),
      catchError(error => {
        console.error('API error:', error);
        return of({ success: false, message: error.message, data: null });
      })
    );
  }

  createVoice(data: FormData | assistantData): Observable<{ success: boolean; message: string; data?: any }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');

    return this.http.post<{ success: boolean; message: string; data?: any }>(`${this.api_sql}?createVoice`,data,{ headers }).pipe(
      map(response => {
        if (response.success) {
          return { success: true, message: 'Voz creada exitosamente', data: response.data };
        } else {
          return { success: false, message: response.message, data: null };
        }
      }),
      catchError(error => {
        console.error('API error:', error);
        return of({ success: false, message: error.message, data: null });
      })
    );
  }


  consultarEmpresas(): Observable<{ success: boolean, message: string, data?: any }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.get<{ success: boolean, message: string, data: any }>(`${this.api_sql}?getCompanies`, { headers }).pipe(
      map(response => {
        if (response.success) {
          return { success: true, message: 'empresas encontrado', data: response.data };
        } else {
          return { success: false, message: 'No hay perfil', data: [] };
        }
      }),
      catchError(error => {
        console.error('API error:', error);
        return of({ success: false, message: error.message, data: [] });
      })
    );
  }

  // Método para crear un asistente, puede manejar tanto FormData como assistantData
  createAssistant(data: FormData | assistantData): Observable<{ success: boolean; message: string; data: assistantData | null }> {
    // Aquí tampoco es necesario establecer el 'Content-Type' cuando se usa FormData
    const headers = !(data instanceof FormData) ? new HttpHeaders().set('Content-Type', 'application/json') : undefined;

    return this.http.post<{ success: boolean; message: string; data: assistantData | null }>(`${this.api_sql}?createAssistant`, data, { headers }).pipe(
      map(response => {
        if (response.success && response.data) {
          return { success: true, message: 'Asistente creado exitosamente', data: response.data };
        } else {
          return { success: false, message: 'Error al crear el asistente', data: null };
        }
      }),
      catchError(error => {
        return of({ success: false, message: error.message, data: null });
      })
    );
  }


  generateAsistants(generateAsistant: assistantData): Observable<{ success: boolean; message: string; data?: any }> {
    const headers = new HttpHeaders().set('Content-Type', 'application/json');
    return this.http.post<{ success: boolean; message: string; data?: any }>(`${this.api_sql}?generateAsistants`,generateAsistant,{ headers }).pipe(
      map(response => {
        if (response.success) {
          return { success: true, message: 'Creado exitosamente', data: response.data };
        } else {
          return { success: false, message: response.message, data: null };
        }
      }),
      catchError(error => {
        console.error('API error:', error);
        return of({ success: false, message: error.message, data: null });
      })
    );
  }
}
