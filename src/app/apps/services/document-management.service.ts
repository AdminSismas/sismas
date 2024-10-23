import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from './general/send-general-requests.service';
import { environment } from '../../../environments/environments';
import { Observable } from 'rxjs';
import {AttachmentCollection} from '../interfaces/attachment.model';


@Injectable({
    providedIn: 'root'
})
export class AttachmentService {
    /* -------------- ATRIBUTOS -------------- */
    basic_url:string = `${environment.url}:${environment.port}${environment.bpmAttachment}${environment.proExecution}`;



    /* -------------- CONSTRUCTRO -------------- */
    constructor(private requestsService: SendGeneralRequestsService) {}

    

    /* -------------- METODOS -------------- */
    getDataPropertyByAttachment(executionId: string):Observable<AttachmentCollection[]> {
        const url = `${this.basic_url}${executionId}`;
        return this.getData(url);
    }

    private getData(url:string):Observable<AttachmentCollection[]>{
        return this.requestsService.sendRequestsFetchGet(url);
    }
}