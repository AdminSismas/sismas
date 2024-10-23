import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';

/* -------------- IMPORTACIONES ARCHIVOS LOCALES -------------- */
import { environment } from '../../../environments/environments';

import { CommentsCollection } from '../interfaces/comments.model';
import { PageCommentsData } from '../interfaces/page-comments-data.model';
import { contentInfoComments } from '../interfaces/content-info-comments.model';
import { SendGeneralRequestsService } from './general/send-general-requests.service';





@Injectable({
    providedIn: 'root'
})
export class CommentsService {
    /* -------------- ATRIBUTOS -------------- */
    basic_url:string = `${environment.url}:${environment.port}${environment.bpmOperation}${environment.comment}`;

    /* -------------- CONSTRUCTRO -------------- */
    constructor(private requestsService: SendGeneralRequestsService) {}

    /* -------------- METODOS -------------- */
    getDataPropertyByComments(executionId: string, pegeData: PageCommentsData):Observable<CommentsCollection> {
        let paramsComm:HttpParams = new HttpParams();
        paramsComm = paramsComm.append('page', `${pegeData.NumPage}`)
        paramsComm = paramsComm.append('size', `${pegeData.NumSize}`)
        const url = `${this.basic_url}${executionId}`;
        return this.getData(url, paramsComm);
    }

    postDataPropertyByComments(executionId: string, body: contentInfoComments) {
        const url = `${this.basic_url}${executionId}`;
        return this.fetchBody(url, body);
    }

    deleteDataPropertyByComments(executionId: string, commentId: number) {
        const url = `${this.basic_url}${executionId}/${commentId}`;
        return this.deleteBody(url);
    }


    /* -------------- METODOS PRIVADOS -------------- */
    private getData(url:string, params:any):Observable<CommentsCollection>{
        return this.requestsService.sendRequestsGetOption(url, {params: params});
    }
    
    private fetchBody(url: string, body: any): Observable<CommentsCollection> {
        return this.requestsService.sendRequestsFetchPostBody(url, body);
    }

    private deleteBody(url: string): Observable<CommentsCollection> {
        return this.requestsService.sendDeleteFetch(url);
    }
}