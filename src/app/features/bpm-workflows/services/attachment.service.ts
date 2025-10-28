import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  url = `${environment.url}:${environment.port}${environment.bpmAttachment.value}${'proExecutionFile'}`;

  private http = inject(HttpClient);

  sendAttachment(formData: any): Observable<any> {
    return this.http.post<any>(this.url, formData);
  }


}
