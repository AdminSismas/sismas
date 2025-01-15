import { Injectable } from '@angular/core';
import { environment } from "src/environments/environments";
import { SendGeneralRequestsService } from './general/send-general-requests.service';
import { HttpClient, HttpParams } from "@angular/common/http";
import { PageProceduresData } from "../interfaces/page-procedures-data.model";
import { Observable } from "rxjs";
import { ProceduresCollection } from "../interfaces/procedures-progress.model";


@Injectable({
  providedIn: 'root'
})
export class ProcedureWorkFinishedService {
   /* -------------- ATRIBUTOS -------------- */
   basic_url = `${environment.url}:${environment.port}${environment.bpmOperation.value}${environment.proExecution}${environment.active}`;

   /* -------------- CONSTRUCTRO -------------- */
   constructor(private requestsService: SendGeneralRequestsService,private http: HttpClient) {}


   /* -------------- MÉTODOS -------------- */
   getDataPropertyByWorkFinishedProcedures(page: PageProceduresData):Observable<ProceduresCollection[]> {
    let paramsPP:HttpParams = new HttpParams();
    paramsPP = paramsPP.append('page', `${page.page}`);
    paramsPP = paramsPP.append('size', `${page.size}`);
    paramsPP = paramsPP.append('beginAt',`${page.beginAt}`);
    paramsPP = paramsPP.append('beginAtE',`${page.beginAtE}`);
    paramsPP = paramsPP.append('executionCode',`${page.executionCode}`);
    paramsPP = paramsPP.append('individualNumber',`${page.individualNumber}`);
    // '{{url}}:{{port}}/bpmOperation/proExecution/finished?page=0&size=10&beginAt=05/01/2024&beginAtE=&executionCode=0&individualNumber='


    console.log('link: ',`${this.basic_url}?` + paramsPP.toString());
    return this.getData(`${this.basic_url}?`,paramsPP);
    }

    private getData(url:string, params:any):Observable<ProceduresCollection[]>{
      // return this.requestsService.sendRequestsGetOption(url, {params: params});
      return  this.http.get<any>(url);
    }

    public getFilterTableProcedureService(page: PageProceduresData):Observable<ProceduresCollection[]>{
      const paramsR:HttpParams = new HttpParams();
      const urlComplete = `${environment.url}:${environment.port}/bpmOperation${environment.proExecution}${environment.finish}?page=${page.page}&size=${page.size}&beginAt=${page.beginAt}&beginAtE=${page.beginAtE}&executionCode=${page.executionCode}&individualNumber=${page.individualNumber}`;
      console.log(urlComplete,'URLS RUTA');  
          console.log(this.basic_url,'baseUrl');                             
     return  this.http.get<any>(urlComplete);
  //    return this.requestsService.sendRequestsGetOption(urlComplete, paramsR);

      }

      async sendRequestsFetchGetAsync(url: string) {
        return this.http.get<any>(url);
      }

      public viewDetailIdProceduresFininsh(idProcedure:number){
        const paramsR:HttpParams = new HttpParams();
        const urlComplete = `${environment.url}:${environment.port}/bpmOperation${environment.proExecution}`;                        
       return  this.http.get<any>(urlComplete + idProcedure);
      }

}
