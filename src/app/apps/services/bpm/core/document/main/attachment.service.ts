import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '@shared/services';
import { Observable } from 'rxjs';
import { environment } from '../../../../../../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class AttachmentService {

  url = `${environment.url}:${environment.port}${environment.bpmAttachment.value}${'proExecutionFile'}`;

  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) { }

  sendAttachment(formData: any): Observable<any> {
    return this.http.post<any>(this.url, formData);
  }


}
