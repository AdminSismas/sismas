import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { environment } from '@environments/environments';
import { catchError, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class IcaPhotosService {
  /* ---- Injects ---- */
  http = inject(HttpClient);

  /* ---- Properties ---- */
  private readonly basicUrl = `${environment.url}:${environment.port}`;

  /* ---- Methods ---- */
  getIcaPhotos(
    baunitId: string,
    municipality: string,
    icaId: number
  ): Observable<{ filename: string; takenDate: Date }[]> {
    const { value: bpmAttachment, baunit } = environment.bpmAttachment;
    const photos = environment.photos;

    const url = `${this.basicUrl}${bpmAttachment}${baunit}/${baunitId}${photos}`;

    const params = new HttpParams()
      .set('municipioId', municipality)
      .set('icaId', `${icaId}`);

    return this.http
      .get<{ filename: string; takenDate: Date }[]>(url, { params })
      .pipe(catchError(() => []));
  }

  addIcaPhoto(
    baunitId: string,
    body: { file: File; municipioId: string; icaId: number }
  ): Observable<string> {
    const { value: bpmAttachment, baunit } = environment.bpmAttachment;
    const photos = environment.photos;
    const url = `${this.basicUrl}${bpmAttachment}${baunit}/${baunitId}${photos}`;

    const { file, municipioId, icaId } = body;

    const formData = new FormData();
    formData.append('file', file);
    formData.append('municipioId', municipioId);
    formData.append('icaId', `${icaId}`);

    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });

    return this.http.post(url, formData, { headers, responseType: 'text' });
  }

  deleteIcaPhoto(urlImage: string): Observable<string> {
    return this.http.delete(urlImage, { responseType: 'text' });
  }
}
