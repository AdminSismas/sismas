import { Injectable } from '@angular/core';
import { environment } from '@environments/environments';
import { Observable, catchError } from 'rxjs';
import { AttachmentCollection } from '@features/bpm-workflows/models/document-management/attachment.model';
import { HttpClient, HttpHeaders } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {
  /* -------------- ATRIBUTOS -------------- */
  basic_url = `${environment.url}:${environment.port}${environment.bpmAttachment.value}/`;
  delete_url = `${environment.url}:${environment.port}${environment.bpmAttachment.value}/`;

  /* -------------- CONSTRUCTOR -------------- */
  constructor(private http: HttpClient) {}

  /* -------------- MÉTODOS -------------- */
  getDataPropertyByAttachment(
    executionId: string
  ): Observable<AttachmentCollection[]> {
    const url = `${this.basic_url}${environment.bpmAttachment.proExecution}${executionId}`;
    return this.getData(url);
  }

  private getData(url: string): Observable<AttachmentCollection[]> {
    return this.http.get<AttachmentCollection[]>(url);
  }

  deleteAttachment(
    executionId: string,
    attachmentId: string,
    originalFileName: string
  ): Observable<AttachmentCollection[]> {
    const url = `${this.delete_url}${executionId}/${attachmentId}/${originalFileName}`;

    return this.http.delete<AttachmentCollection[]>(url).pipe(
      catchError((error) => {
        console.error('Error al eliminar el archivo:', error);
        throw error;
      })
    );
  }

  sendAttachment(formData: FormData): Observable<AttachmentCollection[]> {
    const url = `${this.basic_url}${environment.bpmAttachment.proExecutionFile}`;

    const headers = new HttpHeaders({
      enctype: 'multipart/form-data'
    });

    return this.http.post<AttachmentCollection[]>(url, formData, {
      headers: headers
    });
  }
}
