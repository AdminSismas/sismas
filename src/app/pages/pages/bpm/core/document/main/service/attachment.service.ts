import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, catchError } from 'rxjs';
import { AttachmentCollection } from '../../../../../../../apps/interfaces/documnet-management/attachment.model';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  url = `${environment.url}:${environment.port}${environment.bpmAttachment.value}${'proExecutionFile'}`;

  constructor(private http: HttpClient) { }

  sendAttachment(formData: any): Observable<any> {
    return this.http.post<any>(this.url, formData);
  }


}
