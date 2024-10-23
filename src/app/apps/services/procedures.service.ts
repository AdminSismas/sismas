import { Injectable } from "@angular/core";
import { environment } from "src/environments/environments";
import { SendGeneralRequestsService } from './general/send-general-requests.service';
import { HttpParams } from "@angular/common/http";
import { PageProceduresData } from "../interfaces/page-procedures-data.model";
import { Observable } from "rxjs";
import { ProceduresCollection } from "../interfaces/procedures-progress.model";




@Injectable({
    providedIn: 'root'
})
export class ProceduresService {
    /* -------------- ATRIBUTOS -------------- */
    basic_url:string = `${environment.url}:${environment.port}${environment.bpmOperation}${environment.proExecution}${environment.active}`;

    /* -------------- CONSTRUCTRO -------------- */
    constructor(private requestsService: SendGeneralRequestsService) {}


    /* -------------- METODOS -------------- */
    getDataPropertyByProcedures(page: PageProceduresData):Observable<ProceduresCollection[]> {
        let paramsPP:HttpParams = new HttpParams();
        paramsPP = paramsPP.append('page', `${page.page}`)
        paramsPP = paramsPP.append('size', `${page.size}`)
        paramsPP = paramsPP.append('beginAt',`${page.beginAt}`)
        paramsPP = paramsPP.append('beginAtE',`${page.beginAtE}`)
        paramsPP = paramsPP.append('executionCode',`${page.executionCode}`)
        paramsPP = paramsPP.append('individualNumber',`${page.individualNumber}`)
        
        console.log('link: ',`${this.basic_url}?` + paramsPP.toString());
        return this.getData(`${this.basic_url}?`,paramsPP);
    }


    private getData(url:string, params:any):Observable<ProceduresCollection[]>{
        return this.requestsService.sendRequestsGetOption(url, {params: params});
    }



}