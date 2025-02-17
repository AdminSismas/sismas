import { Injectable } from "@angular/core";
import { environment } from "src/environments/environments";
import { SendGeneralRequestsService } from './general/send-general-requests.service';
import { HttpClient, HttpParams } from "@angular/common/http";
import { PageProceduresData } from "../interfaces/page-procedures-data.model";
import { Observable } from "rxjs";
import { ProceduresCollection } from "../interfaces/procedures-progress.model";




@Injectable({
    providedIn: 'root'
})
export class ProceduresService {
    /* -------------- ATRIBUTOS -------------- */
    basic_url = `${environment.url}:${environment.port}${environment.bpmOperation}${environment.proExecution}${environment.active}`;

    /* -------------- CONSTRUCTRO -------------- */
    constructor(private requestsService: SendGeneralRequestsService,private http: HttpClient) {}


    /* -------------- MÉTODOS -------------- */
    getDataPropertyByProcedures(page: PageProceduresData):Observable<ProceduresCollection[]> {
        let paramsPP:HttpParams = new HttpParams();
        paramsPP = paramsPP.append('page', `${page.page}`);
        paramsPP = paramsPP.append('size', `${page.size}`);
        paramsPP = paramsPP.append('beginAt',`${page.beginAt}`);
        paramsPP = paramsPP.append('beginAtE',`${page.beginAtE}`);
        paramsPP = paramsPP.append('executionCode',`${page.executionCode}`);
        paramsPP = paramsPP.append('individualNumber',`${page.individualNumber}`);

        console.log('link: ',`${this.basic_url}?` + paramsPP.toString());
        return this.getData(`${this.basic_url}?`,paramsPP);
    }


    private getData(url:string, params:any):Observable<ProceduresCollection[]>{
        return this.requestsService.sendRequestsGetOption(url, {params: params});
    }


    public getFilterTableEjecutionService(page: PageProceduresData,urlMain:string):Observable<ProceduresCollection[]>{
        const paramsR:HttpParams = new HttpParams();
        const urlComplete = `${environment.url}:${environment.port}/bpmOperation${environment.proExecution}${urlMain}?page=${page.page}&size=${page.size}&beginAt=${page.beginAt}&beginAtE=${page.beginAtE}&executionCode=${page.executionCode}&individualNumber=${page.individualNumber}`;
            console.log(urlComplete,'URLS RUTA');  
            console.log(this.basic_url,'baseUrl');                             
       return  this.http.get<any>(urlComplete);
    //    return this.requestsService.sendRequestsGetOption(urlComplete, paramsR);

    }

    public getFilterTableHistoryService(page: PageProceduresData):Observable<ProceduresCollection[]>{
        const paramsR:HttpParams = new HttpParams();
        const urlComplete = `${environment.url}:${environment.port}/bpmOperation${environment.proExecution}${environment.active}?page=${page.page}&size=${page.size}&beginAt=${page.beginAt}&beginAtE=${page.beginAtE}&executionCode=${page.executionCode}&individualNumber=${page.individualNumber}`;
            console.log(urlComplete,'URLS RUTA');  
            console.log(this.basic_url,'baseUrl');                             
       return  this.http.get<any>(urlComplete);
    //    return this.requestsService.sendRequestsGetOption(urlComplete, paramsR);
    }
    public getFilterHistoryService(page: PageProceduresData):Observable<ProceduresCollection[]>{
        const paramsR:HttpParams = new HttpParams();
                                                               // /bpmOperation/proExecution/baunitId/active/{{baunitId}}?page=0&size=10
        const urlComplete = `${environment.url}:${environment.port}/bpmOperation${environment.proExecution}baunitId/finish/${page.executionCode}?page=${page.page}&size=${page.size}`;                       
       return  this.http.get<any>(urlComplete);
    //    return this.requestsService.sendRequestsGetOption(urlComplete, paramsR);

    }

    async sendRequestsFetchGetAsync(url: string) {
        return this.http.get<any>(url);
      }

      viewDetailIdProcedures(taskId: number): Observable<any> {
        const urlProcedure =`${environment.url}:${environment.port}${environment.bpmOperation.value}proExecution/`;
        
        const urlTask = `${urlProcedure}${taskId}`;
        return this.http.get<any>(urlTask);
      }
    

      formatDate(date: Date | string, format = 'dd/MM/yyyy'): string {
        const dateObj = new Date(date);
        const day = String(dateObj.getDate()).padStart(2, '0');
        const month = String(dateObj.getMonth() + 1).padStart(2, '0');
        const year = dateObj.getFullYear();
        return format.replace('dd', day).replace('MM', month).replace('yyyy', String(year));
      }

}
