import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '@shared/services';
import { environment } from '../../../../environments/environments';
import { Observable, catchError } from 'rxjs';
import {AttachmentCollection} from '@shared/interfaces';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class AttachmentService {
    /* -------------- ATRIBUTOS -------------- */
    //basic_url:string = `${environment.url}:${environment.port}${environment.bpmAttachment}${environment.proExecution}`;
    basic_url = `${environment.url}:${environment.port}${environment.bpmAttachment.value}${environment.bpmAttachment.proExecution}`;
    delete_url = `${environment.url}:${environment.port}${environment.bpmAttachment.value}`;


    /* -------------- CONSTRUCTOR -------------- */
    constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) {}



    /* -------------- MÉTODOS -------------- */
    getDataPropertyByAttachment(executionId: string):Observable<AttachmentCollection[]> {
        const url = `${this.basic_url}${executionId}`;
        return this.getData(url);
    }

    private getData(url:string):Observable<AttachmentCollection[]>{
        return this.http.get<any>(url);
    }

    deleteAttachment(executionId: string, attachmentId: string, originalFileName: string): Observable<AttachmentCollection[]> {
        const url = `${this.delete_url}${executionId}/${attachmentId}/${originalFileName}`;

        return this.http.delete<AttachmentCollection[]>(url).pipe(
          catchError((error) => {
            console.error('Error al eliminar el archivo:', error);
            throw error;
          })
        );
      }
}
