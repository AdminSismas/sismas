import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { map, Observable } from 'rxjs';
import { environment as envi } from '@environments/environments';

interface Photo {
  filename: string;
  takenDate: Date;
}

@Injectable({
  providedIn: 'root'
})
export class PhotosService {
  private http = inject(HttpClient);
  private base_url = `${envi.url}:${envi.port}${envi.bpmAttachment.value}/${envi.baunit}/`;

  listNamePhotos(
    baunitId: string,
    municipioId: string
  ): Observable<{ url: string; name: string; date: Date }[]> {
    const url = `${this.base_url}${baunitId}${envi.photos}`;
    const params = new HttpParams().set('municipioId', municipioId);

    return this.http.get<Photo[]>(url, { params }).pipe(
      map((photos) => {
        return photos.map((photo) => {
          const urlFile = `${this.base_url}${baunitId}${envi.photos}/${photo.filename}?municipioId=${municipioId}`;
          return {
            url: urlFile,
            name: photo.filename,
            date: photo?.takenDate ?? undefined
          };
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

  uploadPhoto(body: FormData, baunitId: string): Observable<string> {
    const url = `${this.base_url}${baunitId}${envi.photos}`;

    return this.http.post(url, body, {
      responseType: 'text'
    });
  }

  deletePhoto(urlFile: string): Observable<string> {
    return this.http.delete(urlFile, {
      responseType: 'text'
    });
  }
}
