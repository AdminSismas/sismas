import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../../environments/environments';
import { SendGeneralRequestsService } from '../../general/send-general-requests.service';
import { catchError, Observable } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { InformationPegeable } from '../../../interfaces/information-pegeable.model';
import { PageSearchData } from '../../../interfaces/page-search-data.model';
import { ChangeControl } from '../../../interfaces/bpm/change-control';
import { BaunitHead } from '../../../interfaces/information-property/baunit-head.model';

@Injectable({
  providedIn: 'root'
})
export class AlfaMainService {

  basic_url = `${envi.url}:${envi.port}`;

  constructor(
    private requestsService: SendGeneralRequestsService,
    private http: HttpClient
  ) {}

  //{{url}}:{{port}}/changeLog/temp/{{executionId}}
  validateAlfaMainOperations(executionId: string, schemas: string): Observable<ChangeControl> {
    const url = `${this.basic_url}${envi.changeLog}${schemas}/${executionId}`;
    return this.requestsService.sendRequestsFetchGet(url);
  }

  createAlfaMainOperations(executionId: string, schemas: string): Observable<ChangeControl> {
    const url = `${this.basic_url}${envi.changeLog}${schemas}/${executionId}`;
    return this.requestsService.sendRequestsFetchPost(url);
  }

  getListAlfaMainOperations(page: PageSearchData): Observable<InformationPegeable> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', `${page.page}`);
    paramsR = paramsR.append('size', `${page.size}`);
    const url = `${this.basic_url}${envi.temporal}${page.searchData}${envi.operations}`;
    return this.getData(url, paramsR);
  }

  //{{url}}:{{port}}/temporal/clearChangelog
  clearInformationAlfaMain(executionId: string, keyword: string){
    const formdata = new FormData();
    formdata.append('changeLogId', `${executionId}`);
    formdata.append('word', `${keyword}`);

    const url = `${this.basic_url}${envi.temporal}${envi.clearChangelog}`;

    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });

    return this.http.delete(url, { body: formdata, headers });
  }

  //{{url}}:{{port}}/metrict/CadastreChangeLog/{{executionId}}?page=0&size=30
  analyzeChangesBpmOperationAlfaMain(page: PageSearchData): Observable<InformationPegeable> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', `${page.page}`);
    paramsR = paramsR.append('size', `${page.size}`);
    const url = `${this.basic_url}${envi.metrict_cadastral_change}${page.searchData}`;
    return this.getData(url, paramsR);
  }

  //{{url}}:{{port}}/temporal/{{executionId}}/npnlike
  loadingNpnlikeByExecutionId(executionId: string): Observable<string[]> {
    const url = `${this.basic_url}${envi.temporal}${executionId}${envi.npnlike}`;
    return this.requestsService.sendRequestsFetchGet(url);
  }

  //{{url}}:{{port}}/temporal/{{executionId}}/npnlike/18001010100000099/baunits
  loadingListBeaUnitheadByExecutionIdAndNpnLike(executionId: string, npnLike: string): Observable<BaunitHead[]> {
    const url = `${this.basic_url}${envi.temporal}${executionId}${envi.npnlike}/${npnLike}${envi.baunits}`;
    return this.requestsService.sendRequestsFetchGet(url);
  }

  //{{url}}:{{port}}/temporal/BAUnitCreate
  createTemporalBeaUnithead(npnLike: string, executionId: string, bAunitCondition:string): Observable<InformationPegeable> {
    const url = `${this.basic_url}${envi.temporal}${envi.bAUnitCreate}`;
    const formData = new FormData();
    formData.append('npnLike', `${npnLike}`);
    formData.append('changeLogId', `${executionId}`);
    formData.append('domBaunitCondition', `${bAunitCondition}`);
    
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    
    return this.http.post<InformationPegeable>(url, formData, { headers: headers });
  }

  //{{url}}:{{port}}/temporal/BAUnitUpdate
  createUpdateTemporalBeaUnithead(baunitId: string, executionId: string): Observable<InformationPegeable> {
    const url = `${this.basic_url}${envi.temporal}${envi.bAUnitUpdate}`;
    const formData = new FormData();
    formData.append('baunitId', `${baunitId}`);
    formData.append('changeLogId', `${executionId}`);
    
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });

    return this.http.post<InformationPegeable>(url, formData, { headers: headers });
  }

  //{{url}}:{{port}}/temporal/BAUnitDelete
  createDeleteTemporalBeaUnithead(baunitId: string, executionId: string) {
    const url = `${this.basic_url}${envi.temporal}${envi.bAUnitDelete}`;
    const formData = new FormData();
    formData.append('baunitId', `${baunitId}`);
    formData.append('changeLogId', `${executionId}`);
    
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });

    return this.http.delete(url, { body: formData, headers });
  }

  private getData(url: string, params: unknown): Observable<InformationPegeable> {
    return this.requestsService.sendRequestsGetOption(url, { params: params })
      .pipe(catchError(error => this.requestsService.errorNotFound(error)));
  }

}
