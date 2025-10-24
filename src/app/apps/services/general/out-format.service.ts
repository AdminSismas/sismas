import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '@shared/services';
import { environment } from '../../../../environments/environments';
import { catchError, Observable } from 'rxjs';
import { InformationPegeable } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class OutFormatService {

  basic_url = `${environment.url}:${environment.port}`;

  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) { }

   /* -------------- MÉTODOS -------------- */
getDataDocumentoAsociety(page: any):Observable<InformationPegeable> {
  let paramsPP:HttpParams = new HttpParams();
  paramsPP = paramsPP.append('page', `${page.page}`);
  paramsPP = paramsPP.append('size', `${page.size}`);
  const urlComplete = `${this.basic_url}/bpmOutTemplate?page=${page.page}&size=${page.size}&sortBy=templateCode`;
  return  this.http.get<any>(urlComplete);
}

  /* -------------- MÉTODOS -------------- */
  setDataDocumentoAsocietySave(page: any,value:any):Observable<InformationPegeable> {
    let paramsPP:HttpParams = new HttpParams();
    paramsPP = paramsPP.append('page', `${page.page}`);
    paramsPP = paramsPP.append('size', `${page.size}`);
    const urlComplete = `${this.basic_url}/bpmOutTemplate`;
    return  this.http.post<any>(urlComplete,value);
  }

  /* -------------- MÉTODOS -------------- */
  setUDocumentoAsocietyUpdate(page: any,value:any):Observable<InformationPegeable> {
    let paramsPP:HttpParams = new HttpParams();
    paramsPP = paramsPP.append('page', `${page.page}`);
    paramsPP = paramsPP.append('size', `${page.size}`);
    const urlComplete = `${this.basic_url}/bpmOutTemplate/${value.outTemplateId}`;
    return  this.http.patch<any>(urlComplete,value);
  }

  setUDocumentoAsocietyDelete(outTemplateId:any):Observable<any> {
    const paramsPP:HttpParams = new HttpParams();
    const urlComplete = `${this.basic_url}/bpmOutTemplate/${outTemplateId}`;
    return  this.http.delete<InformationPegeable>(urlComplete);
  }
}
