import { Injectable } from '@angular/core';
import { environment as envi } from '../../../../../environments/environments';
import { BehaviorSubject, catchError, Observable , EMPTY, throwError } from 'rxjs';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { InformationPegeable } from '@shared/interfaces';
import { PageSearchData } from '@shared/interfaces';
import { ChangeControl } from '@shared/interfaces';
import { BaunitHead } from '@shared/interfaces';
import { saveAs } from 'file-saver';

@Injectable({
  providedIn: 'root'
})
export class AlfaMainService {
  private _refreshData = new BehaviorSubject<boolean>(false);
  refreshData$ = this._refreshData.asObservable();

  basic_url = `${envi.url}:${envi.port}`;

  constructor(
    private http: HttpClient
  ) {}

  refresh() {
    this._refreshData.next(true);
  }

  //{{url}}:{{port}}/changeLog/temp/{{executionId}}
  validateAlfaMainOperations(
    executionId: string,
    schemas: string
  ): Observable<ChangeControl> {
    const url = `${this.basic_url}${envi.changeLog}${schemas}/${executionId}`;
    return this.http.get<any>(url);
  }

  //{{url}}:{{port}}/changeLog/temp/{{executionId}}
  createAlfaMainOperations(
    executionId: string,
    schemas: string
  ): Observable<ChangeControl> {
    const url = `${this.basic_url}${envi.changeLog}${schemas}/${executionId}`;
    return this.requestsService.sendRequestsFetchPost(url);
  }

  getListAlfaMainOperations(
    page: PageSearchData
  ): Observable<InformationPegeable> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', `${page.page}`);
    paramsR = paramsR.append('size', `${page.size}`);
    const url = `${this.basic_url}${envi.temporal}${page.searchData}${envi.operations}`;
    return this.getData(url, paramsR);
  }

  //{{url}}:{{port}}/temporal/clearChangelog
  clearInformationAlfaMain(executionId: string, keyword: string) {
    const formdata = new FormData();
    formdata.append('changeLogId', `${executionId}`);
    formdata.append('word', `${keyword}`);
    const url = `${this.basic_url}${envi.temporal}${envi.clearChangelog}`;
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.delete(url, { body: formdata, headers });
  }

  //{{url}}:{{port}}/metrict/CadastreChangeLog/{{executionId}}?page=0&size=30
  analyzeChangesBpmOperationAlfaMain(
    page: PageSearchData
  ): Observable<InformationPegeable> {
    let paramsR: HttpParams = new HttpParams();
    paramsR = paramsR.append('page', `${page.page}`);
    paramsR = paramsR.append('size', `${page.size}`);
    const url = `${this.basic_url}${envi.metrict_cadastral_change}${page.searchData}`;
    return this.getData(url, paramsR);
  }

  //{{url}}:{{port}}/temporal/{{executionId}}/npnlike
  loadingNpnlikeByExecutionId(executionId: string): Observable<string[]> {
    const url = `${this.basic_url}${envi.temporal}${executionId}${envi.npnlike}`;
    return this.http.get<any>(url);
  }

  //{{url}}:{{port}}/temporal/{{executionId}}/npnlike/18001010100000099/baunits
  loadingListBeaUnitheadByExecutionIdAndNpnLike(
    executionId: string,
    npnLike: string
  ): Observable<BaunitHead[]> {
    const url = `${this.basic_url}${envi.temporal}${executionId}${envi.npnlike}/${npnLike}${envi.baunits}`;
    return this.http.get<any>(url);
  }

  //{{url}}:{{port}}/temporal/BAUnitCreate
  createTemporalBeaUnithead(
    npnLike: string,
    executionId: string,
    bAunitCondition: string
  ): Observable<InformationPegeable> {
    const url = `${this.basic_url}${envi.temporal}${envi.bAUnitCreate}`;
    const formData = new FormData();
    formData.append('npnLike', `${npnLike}`);
    formData.append('changeLogId', `${executionId}`);
    formData.append('domBaunitCondition', `${bAunitCondition}`);
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });

    return this.http.post<InformationPegeable>(url, formData, {
      headers: headers
    });
  }

  //{{url}}:{{port}}/temporal/BAUnitUpdate
  createUpdateTemporalBeaUnithead(
    baunitId: string,
    executionId: string
  ): Observable<InformationPegeable> {
    const url = `${this.basic_url}${envi.temporal}${envi.bAUnitUpdate}`;
    const formData = new FormData();
    formData.append('baunitId', `${baunitId}`);
    formData.append('changeLogId', `${executionId}`);
    const headers = new HttpHeaders({ enctype: 'multipart/form-data' });
    return this.http.post<InformationPegeable>(url, formData, {
      headers: headers
    });
  }

  //{{url}}:{{port}}/temporal/BAUnitDelete
  createDeleteTemporalBeaUnitHead(baUnitId: string, executionId: string) {
    const params: HttpParams = new HttpParams()
      .set('baunitId', `${baUnitId}`)
      .set('changeLogId', `${executionId}`);
    return this.http.delete(
      `${this.basic_url}${envi.temporal}${envi.bAUnitDelete}`,
      { params }
    );
  }

  //{{url}}:{{port}}/temporal/BAUnitDeleteExistTemp
  changeTemporaryStateBeaUnitHeadByExistTemp(
    baUnitId: string,
    executionId: string
  ) {
    const params: HttpParams = new HttpParams()
      .set('baunitId', `${baUnitId}`)
      .set('changeLogId', `${executionId}`);
    return this.http.delete(
      `${this.basic_url}${envi.temporal}${envi.bAUnitDeleteExistTemp}`,
      { params }
    );
  }

  /**
   * MAIN
   *
   * */
  // {{url}}:{{port}}/baunit/main/{{executionId}}/{{baunitId}}
  getBaUnitHead(baunitId: string): Observable<BaunitHead> {
    const url = `${this.basic_url}/${envi.baunit}/${envi.schemas.main}/${baunitId}`;
    return this.http.get<any>(url);
  }

  /**
   * TEMPORAL
   *
   * */
  // {{url}}:{{port}}/baunit/temp/{{executionId}}/{{baunitId}}
  getBaUnitHeadTemporal(
    executionId: string,
    baunitId: string
  ): Observable<BaunitHead> {
    const url = `${this.basic_url}/${envi.baunit}/${envi.schemas.temp}/${executionId}/${baunitId}`;
    return this.http.get<any>(url);
  }

  /**
   * HISTORY
   *
   * */
  // {{url}}:{{port}}/baunit/hist/{{executionId}}/{{baunitId}}
  getBaUnitHeadHistory(
    executionId: string,
    baunitId: string
  ): Observable<BaunitHead> {
    const url = `${this.basic_url}/${envi.baunit}/${envi.schemas.hist}/${executionId}/${baunitId}`;
    return this.http.get<any>(url);
  }

  private getData(
    url: string,
    params: unknown
  ): Observable<InformationPegeable> {
    return this.requestsService
      .sendRequestsGetOption(url, { params: params })
      .pipe(catchError((error) => (error.status === 404 ? EMPTY : throwError(() => error))));
  }

  //{{url}}:{{port}}/temporal/{{executionId}}/excel/generate
  getGenerateExcelMassive(executionId: string) {
    this.http
      .get(
        `${this.basic_url}${envi.temporal}${executionId}${envi.excel}${envi.generate}`,
        { responseType: 'blob' }
      )
      .subscribe({
        next: (response) => {
          const blob = new Blob([response], {
            type: 'application/octet-stream'
          });
          saveAs(blob, `massiveDownload_${executionId}.xlsx`);
        }
      });
  }

  //{{url}}:{{port}}/temporal/{{executionId}}/excel/load
  loadingExcelMassive(executionId: string, formData: FormData) {
    return this.requestsService
      .sendRequestsFetchPostBody(
        `${this.basic_url}${envi.temporal}${executionId}${envi.excel}${envi.load}`,
        formData
      )
      .pipe(catchError((error) => (error.status === 404 ? EMPTY : throwError(() => error))));
  }

  getValidityOptions(executionId: string): Observable<string[]> {
    const url = `${this.basic_url}${envi.temporal}${envi.validity}/${executionId}`;

    return this.http.get<string[]>(url);
  }

  changeValidityProcedure(
    executionId: string,
    body: ChangeControl
  ): Observable<ChangeControl> {
    const url = `${this.basic_url}${envi.changeLog}${envi.schemas.temp}/${executionId}`;

    return this.http.put<ChangeControl>(url, body);
  }

  autoAppraisalExecution(
    executionId: string,
    baunitId: string,
    parameters: {
      validity: string;
      toggleValuationType: boolean;
      selfValuationValue: string;
      selfValuationValueLand: string;
      selfValuationValueUnits: string;
    }
  ): Observable<void> {
    const url = `${this.basic_url}${envi.temporal}${executionId}${envi.selfvaluation}/${baunitId}`;

    const params = new HttpParams()
      .set('validity', parameters.validity)
      .set('selfValuationValue', parameters.selfValuationValue ?? 0)
      .set('selfValuationValueLand', parameters.selfValuationValueLand ?? 0)
      .set('selfValuationValueUnits', parameters.selfValuationValueUnits ?? 0);

    return this.http.put<void>(url, {}, { params });
  }
}
