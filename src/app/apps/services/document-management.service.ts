import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from './general/send-general-requests.service';
import { environment } from '../../../environments/environments';
import { Observable, catchError } from 'rxjs';
import {AttachmentCollection} from '../interfaces/attachment.model';
import { HttpClient } from '@angular/common/http';


@Injectable({
    providedIn: 'root'
})
export class AttachmentService {
    /* -------------- ATRIBUTOS -------------- */
    //basic_url:string = `${environment.url}:${environment.port}${environment.bpmAttachment}${environment.proExecution}`;
    basic_url:string = `${environment.url}:${environment.port}${environment.bpmAttachment.value}${environment.bpmAttachment.proExecution}`;
    delete_url:string = `${environment.url}:${environment.port}${environment.bpmAttachment.value}`;


    /* -------------- CONSTRUCTRO -------------- */
    constructor(private requestsService: SendGeneralRequestsService, private http: HttpClient) {}



    /* -------------- MÉTODOS -------------- */
    getDataPropertyByAttachment(executionId: string):Observable<AttachmentCollection[]> {
        const url = `${this.basic_url}${executionId}`;
        return this.getData(url);
    }

    private getData(url:string):Observable<AttachmentCollection[]>{
        return this.requestsService.sendRequestsFetchGet(url);
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
