import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment as envi } from 'src/environments/environments';

export interface Photo {
  key: string;
  url: string;
}

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  private base_url = `${envi.url}:${envi.port}${envi.bpmAttachment.value}${envi.baunit}/`;

  constructor(private http: HttpClient) {}

  listNamePhotos(baunitId: string, municipioId: string): Observable<string[]> {
    const url = `${this.base_url}${baunitId}${envi.photos}`;
    const params = new HttpParams().set('municipioId', municipioId);

    return this.http.get<string[]>(url, { params }).pipe(
      map((fileNames) => {
        return fileNames.map((fileName:string) => {
          const urlFile = `${this.base_url}${baunitId}${envi.photos}/${fileName}?municipioId=${municipioId}`;
          return urlFile;
        });
      })
    );
  }

  getPhotoFile(
    baunitId: string,
    fileName: string,
    municipioId: string
  ): Observable<Blob> {
    const url = `${this.base_url}${baunitId}${envi.photos}/${fileName}`;
    const params = new HttpParams().set('municipioId', municipioId);

    return this.http.get<Blob>(url, { params, responseType: 'blob' as 'json' });
  }
}
