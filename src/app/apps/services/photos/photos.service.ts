import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { catchError, map } from 'rxjs/operators';

export interface Photo {
  key: string;
  lastModified: string;
  size: number;
  url: string;
}

@Injectable({
  providedIn: 'root',
})
export class PhotosService {
  private endpoint = 'https://dev.api.cic-ware.com/geogegestionbacks3/confi.php';

  constructor(private http: HttpClient) {}

  /**
   * Listar fotos desde el endpoint
   * @returns Observable<Photo[]>
   */
  listPhotos(): Observable<Photo[]> {
    console.log('Obteniendo fotos desde el endpoint:', this.endpoint);
    return this.http.get<any>(this.endpoint).pipe(
      map((response) => {
        console.log('Respuesta del endpoint:', response); // Verifica el JSON
        if (!response || !response.files || !Array.isArray(response.files)) {
          throw new Error('La respuesta no contiene un array válido en la propiedad "files".');
        }
  
        return response.files.map((file: any) => ({
          key: file.key,
          lastModified: file.lastModified,
          size: file.size,
          url: file.url,
        }));
      }),
      catchError((error) => {
        console.error('Error en el servicio:', error);
        return [];
      })
    );
  }
  
  
  
}
