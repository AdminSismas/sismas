import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

export interface Photo {
  key: string;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private endpoint = 'https://dev.api.cic-ware.com/geogegestionbacks3/confi.php';

  constructor(private http: HttpClient) {}

  /**
   * Listar fotos filtradas por baunitId, con paginación
   * @param id baunitId para filtrar
   * @param page Página actual
   * @param limit Número de resultados por página
   * @returns Observable con un array de URLs de imágenes
   */
  listPhotos(id: string, page: number = 1, limit: number = 100): Observable<string[]> {
    const params = new HttpParams()
      .set('id', id)
      .set('page', page)
      .set('limit', limit);

    return this.http.get<any>(this.endpoint, { params }).pipe(
      map((response) => {
        if (!response || !response.files || !Array.isArray(response.files)) {
          throw new Error('Respuesta inválida del servidor.');
        }
        return response.files; // Retornar solo el array de archivos
      }),
      catchError((error) => {
        // console.error('Error al obtener las fotos:', error);
        throw error;
      })
    );
  }
}
