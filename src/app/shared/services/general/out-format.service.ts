import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '@environments/environments';
import { InformationPegeable } from '@shared/models/pageable';

@Injectable({
  providedIn: 'root'
})
export class OutFormatService {
  private readonly http = inject(HttpClient);

  private readonly basic_url = `${environment.url}:${environment.port}`;

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
    const urlComplete = `${this.basic_url}/bpmOutTemplate/${outTemplateId}`;
    return  this.http.delete<InformationPegeable>(urlComplete);
  }
}
