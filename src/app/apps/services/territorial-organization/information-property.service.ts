import { inject, Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { BehaviorSubject, catchError, Observable, Subject, throwError } from 'rxjs';
import { BasicInformationProperty, UpdateBasicInformationProperty } from '../../interfaces/information-property/basic-information-property';
import { InformationPegeable } from '../../interfaces/information-pegeable.model';
import { HttpClient, HttpErrorResponse, HttpParams } from '@angular/common/http';
import { BasicInformationAddress } from '../../interfaces/information-property/basic-information-address';
import { CreateBasicInformationAddress, DetailBasicInformationAddress } from '../../interfaces/information-property/detail-basic-information-address';
import { InfoOwners } from '../../interfaces/information-property/info-owners';
import { PageSearchData } from '../../interfaces/page-search-data.model';
import { ContentInformationConstruction, CreateBasicInformationConstruction } from '../../interfaces/information-property/content-information-construction';
import { CcCalificacionUB } from '../../interfaces/information-property/cc-calificacion-ub';
import { ZoneBAUnit } from '../../interfaces/information-property/zone-baunit';
import { EVIRONMENT_CC_DIRECCION } from '../../constants/constant';
import { RuralPhysicalZone } from '../../interfaces/information-property/rural-physical-zone';
import { UrbanPhysicalZone } from '../../interfaces/information-property/urban-physical-zone';
import { GeoEconomicZone } from '../../interfaces/information-property/geo-economic-zone';

@Injectable({
  providedIn: 'root'
})
export class InformationPropertyService {
  basic_url = `${envi.url}:${envi.port}`;
  public ccAddress:string = EVIRONMENT_CC_DIRECCION;
  private httpClient = inject(HttpClient);

  reloadTable$ = new Subject<boolean>();
  reloadTableStarted$: Observable<boolean> = this.reloadTable$.asObservable();

  showOptionsPerson$ = new BehaviorSubject<boolean>(false);
  showOptionsPersonStarted$: Observable<boolean> = this.showOptionsPerson$.asObservable();

  constructor(private requestsService: SendGeneralRequestsService, private http: HttpClient) {}

  public reloadTableSet(value:boolean):void{
    this.reloadTable$.next(value);
  }

  public showOptionsPersonSet(value:boolean):void{
    this.showOptionsPerson$.next(value);
  }

  getBasicInformationProperty(
    schema: string,
    id: string,
    executionId: string | null | undefined = null
  ): Observable<BasicInformationProperty> {
    let url = `${this.basic_url}${envi.baunit}${schema}`;
    if (!executionId || (executionId && schema === `${envi.schemas.main}`)) {
      url += `/${id}`;
    } else {
      url += `/${executionId}/${id}`;
    }
    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(
        catchError((error) => this.requestsService.errorNotFound(error))
      );
  }

  getBasicInformationPropertyAddresses(
    schema: string,
    id: string
  ): Observable<BasicInformationAddress[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('baunitId', `${id}`);
    const url = `${this.basic_url}${envi.basicAddress}`;
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  getDetailBasicInformationPropertyAddresses(
    schema: string,
    id: string | undefined
  ): Observable<DetailBasicInformationAddress> {
    const url = `${this.basic_url}${envi.ccDireccion}${id}`;
    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }



  getInformationPropertyOwners(
    schema: string,
    id: string,
    executionId: string | null | undefined = null
  ): Observable<InfoOwners[]> {
    let url = `${this.basic_url}${envi.rrright}${schema}`;
    if (!executionId || (executionId && schema === `${envi.schemas.main}`)) {
      url += `/${id}`;
    } else {
      url += `/${executionId}/${id}`;
    }
    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }

  getBasicInformationPropertyConstructions(
    page: PageSearchData,
    schema: string,
    executionId: string | null | undefined = null
  ): Observable<InformationPegeable> {
    let params: HttpParams = new HttpParams();
    params = params.append('page', `${page.page}`);
    params = params.append('size', `${page.size}`);
    params = params.append('sortBy', `unitBuiltLabel`);
    let url = `${this.basic_url}${envi.unitBuilt}/${schema}`;
    if (!executionId || (executionId && schema === `${envi.schemas.main}`)) {
      url += `/${page.searchData}`;
    } else {
      url += `/${executionId}/${page.searchData}`;
    }
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }
  // ${executionId}/${baunitId}
  getDetailBasicInformationPropertyConstructions(
    schema: string,
    id: number | undefined

  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url} ${envi.unitBuilt} ${envi.schemas.temp}/${id}`;

    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }

  getDetailBasicInformationPropertyCalificationConstructions(
    schema: string,
    unitBuiltId: number | undefined,
    baunitId: number | undefined
  ): Observable<CcCalificacionUB[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('unitBuiltId', `${unitBuiltId}`);
    const url = `${this.basic_url}${envi.calificationUB}${envi.unitBuild}`;
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  getBasicInformationsAppraisalsProperty(
    page: PageSearchData,
    schema: string,
    executionId: string | null | undefined = null
  ): Observable<InformationPegeable> {
    let params: HttpParams = new HttpParams();
    params = params.append('page', `${page.page}`);
    params = params.append('size', `${page.size}`);
    params = params.append('sortBy', `validityValuation`);
    let url = `${this.basic_url}${envi.valuation}${schema}`;
    if (!executionId || (executionId && schema === `${envi.schemas.main}`)) {
      url += `/${page.searchData}`;
    } else {
      url += `/${executionId}/${page.searchData}`;
    }
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  getBasicInformationPropertyZones(
    id: string,
    schema: string,
    executionId: string | null | undefined = null
  ): Observable<ZoneBAUnit[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('baunitId', `${id}`);
    const url = `${this.basic_url}${envi.baUnitZona_baunitId}`;
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  getByBauniFisica(
    id: string,
    schema: string,
    executionId: string | null | undefined = null
  ): Observable<ZoneBAUnit[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('baunitId', `${id}`);
    const url = `${this.basic_url}/${'baUnitZona'}/${'baunitIdFisicas'}`;
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  getByBauniEcono(
    id: string,
    schema: string,
    executionId: string | null | undefined = null
  ): Observable<ZoneBAUnit[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('baunitId', `${id}`);
    const url = `${this.basic_url}/${'baUnitZona'}/${'baunitIdEcono'}`;
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }
  getByDivPolUrbana(): Observable<UrbanPhysicalZone[]> {
    const divpolLv1 = 18;
    const divpolLv2 = '001';
    
    let params: HttpParams = new HttpParams();
    params = params.append('divpolLv1', `${divpolLv1}`);
    params = params.append('divpolLv2', `${divpolLv2}`);
    
    const url = `${this.basic_url}/${'ccZonaHomoFisicaUr'}/${'divpol'}`;
  
    console.log('url', url);
    
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  getByDivPolRural(): Observable<RuralPhysicalZone[]> {

    const divpolLv1 = 18;
    const divpolLv2 = '001'; 
    let params: HttpParams = new HttpParams();
    params = params.append('divpolLv1', `${divpolLv1}`);
    params = params.append('divpolLv2', `${divpolLv2}`);
    const url = `${this.basic_url}/${'ccZonaHomoFisicaRu'}/${'divpol'}`;

    console.log('url', url);
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );

  }

  getByDivPolGeoeconomica(): Observable<GeoEconomicZone[]> {

    const divpolLv1 = 18;
    const divpolLv2 = '001'; 
    let params: HttpParams = new HttpParams();
    params = params.append('divpolLv1', `${divpolLv1}`);
    params = params.append('divpolLv2', `${divpolLv2}`);
    const url = `${this.basic_url}/${'ccZonaHomoGeoEconomica'}/${'divpol'}`;

    console.log('url', url);
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );

  }

  createBAUnitZones(body: any, baunitId: number, validityValuation: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('baunitId', `${baunitId}`);
    params = params.append('validityValuation', `${validityValuation}`);
    const url = `${this.basic_url}/${'baUnitZona'}`;
    return this.http.post(url, body, { params: params });
  }

  updateBAUnitZones(baUnitZonaId: number, body: any, baunitId: number, validityValuation: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('baunitId', `${baunitId}`);
    params = params.append('validityValuation', `${validityValuation}`);
    const url = `${this.basic_url}/${'baUnitZona'}/${baUnitZonaId}`;
    return this.http.put(url, body, { params: params });
  }

  deleteBAUnitZones(baUnitZonaId:number, baunitId: number, validityValuation: number, version: number): Observable<any> {
    let params: HttpParams = new HttpParams();
    params = params.append('baunitId', `${baunitId}`);
    params = params.append('validityValuation', `${validityValuation}`);
    params = params.append('version', `${version}`);
    const url = `${this.basic_url}/${'baUnitZona'}/${baUnitZonaId}`;
    return this.http.delete(url, { params: params });
  }

  /**
   * Update basic information address
   *
   * @param updateBasicInformationAddress
   * @param id
   * @returns
   */
  updateBasicInformationPropertyAddress(
    id: string,
    updateBasicInformationAddress: Partial<DetailBasicInformationAddress>
  ): Observable<DetailBasicInformationAddress> {
    const url = `${this.basic_url}${envi.ccDireccion}${id}`;
    return this.httpClient.put<DetailBasicInformationAddress>(
      url,
      updateBasicInformationAddress
    );
  }

  updateBasicInformationPropertyConstruction(
    id: string,
    updateBasicInformationConstruction: Partial<ContentInformationConstruction>
  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url}${envi.ccDireccion}${id}`;
    return this.httpClient.put<ContentInformationConstruction>(
      url,
      updateBasicInformationConstruction
    );
  }

  updateConstruction(executionId: number, baunitId: number, data: any): Observable<any> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}`;
    console.log('data', data);
    return this.http.put(url, data);
  }

  updateBasicInformationProperty(executionId: string, baunitId: string, body: UpdateBasicInformationProperty): Observable<BasicInformationProperty> {

    const url = `${this.basic_url}${envi.baunit}temp/${executionId}/${baunitId}`;

    return this.http.put<BasicInformationProperty>(url, body)
      .pipe(
        catchError(error => {
          console.log('Error en la edición de los aspectos generales del predio');
          throw error;
        })
      );
  }
  /**
   * Create basic information address
   *
   * @param baunitId
   * @param createBasicInformationAddress
   * @returns
   */
  createBasicInformationPropertyAddress(
    baunitId: string,
    createBasicInformationAddress: CreateBasicInformationAddress,
  ): Observable<DetailBasicInformationAddress> {
    const url = `${this.basic_url}${this.ccAddress}`;
    const httpParams: HttpParams = new HttpParams()
      .set('baunitId', baunitId);
    return this.httpClient.post<DetailBasicInformationAddress>(
      url,
      createBasicInformationAddress,
      { params: httpParams }
    );
  }

  createBasicInformationPropertyConstruction(
    executionId: string,
    baunitId: string,
    createBasicInformationConstruction: CreateBasicInformationConstruction
  ): Observable<ContentInformationConstruction> {

    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}`;

    return this.http
      .post<ContentInformationConstruction>(url, createBasicInformationConstruction)
      .pipe(
        catchError((error: HttpErrorResponse) => {
          let errorMessage = 'Ocurrió un error inesperado.';


          if (error.error && error.error.message) {
            errorMessage = error.error.message;
          } else if (error.error && error.error) {
            errorMessage = error.error;
          }

          return throwError(() => new Error(errorMessage));
        })
      );
  }



  /**
   * Delete basic information by direccionId
   * @param id
   * @returns
   */
  deleteBasicInformationPropertyAddress(direccionId: string): Observable<any> {
    const url = `${this.basic_url}${envi.ccDireccion}${direccionId}`;
    const httpParams: HttpParams = new HttpParams().set('version', '99999');
    
    return this.httpClient.delete(url, { params: httpParams});
  }

  deleteBasicInformationPropertyConstruction(constructionId: string): Observable<any> {
    const url = `${this.basic_url}${envi.ccDireccion}/${constructionId}`;
    const httpParams: HttpParams = new HttpParams()
      .set('version', '9999999');
    return this.httpClient.delete(url, { params: httpParams });
  }

  deleteConstruction(baunitId: string, changeLogId: string, unitBuiltId: number): Observable<any> {
    const url = `${this.basic_url}${envi.unitBuilt}`;

    const formData = new FormData();

    formData.append('baunitId', baunitId.toString());
    formData.append('changeLogId', changeLogId.toString());
    formData.append('unitBuiltId', unitBuiltId.toString());
    formData.append('word', 'borrar');


    return this.httpClient.delete(url, { body: formData });
  }

  private getData(url: string, params: any): Observable<any> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }
}
