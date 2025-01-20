import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environments';
import { catchError, Observable } from 'rxjs';
import { InformationPegeable } from '../interfaces/information-pegeable.model';

@Injectable({
  providedIn: 'root'
})
export class OutFormatService {

  basic_url: string = `${environment.url}:${environment.port}`;

  constructor(private http: HttpClient) { }

   /* -------------- MÉTODOS -------------- */
getDataDocumentoAsociety(page: any):Observable<InformationPegeable> {
  let paramsPP:HttpParams = new HttpParams();
  paramsPP = paramsPP.append('page', `${page.page}`);
  paramsPP = paramsPP.append('size', `${page.size}`);
  const urlComplete = `${this.basic_url}/bpmOutTemplate?page=${page.page}&size=${page.size}&sortBy=templateCode`;
  console.log('link: ',urlComplete);

  // console.log('link: ',`${this.basic_url}?` + paramsPP.toString());
  return  this.http.get<any>(urlComplete);
}

  /* -------------- MÉTODOS -------------- */
  setDataDocumentoAsocietySave(page: any,value:any):Observable<InformationPegeable> {
    let paramsPP:HttpParams = new HttpParams();
    paramsPP = paramsPP.append('page', `${page.page}`);
    paramsPP = paramsPP.append('size', `${page.size}`);
    const urlComplete = `${this.basic_url}/bpmOutTemplate`;
    console.log('link: ',urlComplete);
  
    // console.log('link: ',`${this.basic_url}?` + paramsPP.toString());
    return  this.http.post<any>(urlComplete,value);
  }

  /* -------------- MÉTODOS -------------- */
  setUDocumentoAsocietyUpdate(page: any,value:any):Observable<InformationPegeable> {
    let paramsPP:HttpParams = new HttpParams();
    paramsPP = paramsPP.append('page', `${page.page}`);
    paramsPP = paramsPP.append('size', `${page.size}`);
    const urlComplete = `${this.basic_url}/bpmOutTemplate/${value.outTemplateId}`;
    console.log('link: ',urlComplete);
  
    // console.log('link: ',`${this.basic_url}?` + paramsPP.toString());
    return  this.http.patch<any>(urlComplete,value);
  }

  setUDocumentoAsocietyDelete(outTemplateId:any):Observable<any> {
    let paramsPP:HttpParams = new HttpParams();

    const urlComplete = `${this.basic_url}/bpmOutTemplate/${outTemplateId}`;
    console.log('link: ',urlComplete);
  
    // console.log('link: ',`${this.basic_url}?` + paramsPP.toString());
    return  this.http.delete<InformationPegeable>(urlComplete);
  }
}
