/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import {
  BehaviorSubject,
  catchError,
  Observable,
  Subject,
  throwError
} from 'rxjs';
import {
  BasicInformationProperty,
  UpdateBasicInformationProperty
} from '../../interfaces/information-property/basic-information-property';
import { InformationPegeable } from '../../interfaces/general/information-pegeable.model';
import {
  HttpClient,
  HttpErrorResponse,
  HttpParams
} from '@angular/common/http';
import {
  CreateBasicInformationAddress,
  DetailBasicInformationAddress
} from '../../interfaces/information-property/detail-basic-information-address';
import { InfoOwners } from '../../interfaces/information-property/info-owners';
import { PageSearchData } from '../../interfaces/general/page-search-data.model';
import {
  ContentInformationConstruction,
  CreateBasicInformationConstruction
} from '../../interfaces/information-property/content-information-construction';
import { CcCalificacionUB } from '../../interfaces/information-property/cc-calificacion-ub';
import {
  CreateBaunitZone,
  ZoneBAUnitResponse
} from '../../interfaces/information-property/zone-baunit';
import { RuralPhysicalZone } from '../../interfaces/information-property/rural-physical-zone';
import { UrbanPhysicalZone } from '../../interfaces/information-property/urban-physical-zone';
import { GeoEconomicZone } from '../../interfaces/information-property/geo-economic-zone';
import { BasicInformationAdjacent } from '../../interfaces/information-property/basic-information-adjacent';

@Injectable({
  providedIn: 'root'
})
export class InformationPropertyService {
  basic_url = `${envi.url}:${envi.port}`;
  private httpClient = inject(HttpClient);

  reloadTable$ = new Subject<boolean>();
  reloadTableStarted$: Observable<boolean> = this.reloadTable$.asObservable();

  showOptionsPerson$ = new BehaviorSubject<boolean>(false);
  showOptionsPersonStarted$: Observable<boolean> =
    this.showOptionsPerson$.asObservable();

  showRulePage$ = new BehaviorSubject<boolean>(false);
  showOptionsRulePage$: Observable<boolean> = this.showRulePage$.asObservable();

  constructor(
    private requestsService: SendGeneralRequestsService,
    private http: HttpClient
  ) {}

  public reloadTableSet(value: boolean): void {
    this.reloadTable$.next(value);
  }

  public showOptionsPersonSet(value: boolean): void {
    this.showOptionsPerson$.next(value);
  }

  public showRulePageSet(value: boolean): void {
    this.showRulePage$.next(value);
  }

  getBasicInformationProperty(
    schema: string,
    id: string,
    executionId: string | null | undefined = null
  ): Observable<BasicInformationProperty> {
    let url = `${this.basic_url}/${envi.baunit}/${schema}`;
    if (!executionId || (executionId && schema === `${envi.schemas.main}`)) {
      url += `/${id}`;
    } else {
      url += `/${executionId}/${id}`;
    }
    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }

  getBasicInformationPropertyAddresses(
    executionId: string | null | undefined,
    baunitId: string | null | undefined,
    schema: string,
    page: number,
    pageSize: number
  ): Observable<InformationPegeable> {
    const params: HttpParams = new HttpParams()
      .set('page', page)
      .set('size', pageSize);

    let url: string;
    if (executionId) {
      //       {{url}}:{{port}}/ccDireccion/temp/{{executionId}}/{{baunitId}}?page=0&size=20
      url = `${this.basic_url}${envi.ccDireccion}/${schema}/${executionId}/${baunitId}`;
    } else {
      //       {{url}}:{{port}}/ccDireccion/main/{{baunitId}}?page=0&size=10
      url = `${this.basic_url}${envi.ccDireccion}/${schema}/${baunitId}`;
    }
    // const url = `${this.basic_url}${envi.basicAddress}`;

    return this.http
      .get<InformationPegeable>(url, { params })
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }

  getDetailBasicInformationPropertyAddresses(
    directionId: string,
    schema: string,
    baunitId?: number | string,
    executionId?: string | null
  ): Observable<DetailBasicInformationAddress> {
    let url: string;
    if (executionId){
      //            {{url}}:{{port}}/ccDireccion/temp/{{executionId}}/{{baunitId}}/{{direccionId}}
      url = `${this.basic_url}${envi.ccDireccion}/${schema}/${executionId}/${baunitId}/${directionId}`;
    } else {
      url = `${this.basic_url}${envi.ccDireccion}/${directionId}`;
    }

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

  getBasicInformationPropertyAdjacent(
    baunitId: string
  ): Observable<BasicInformationAdjacent[]> {
    const url = `${this.basic_url}/ccColindante/${envi.baunit}/${baunitId}`;
    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }

  // ${executionId}/${baunitId}
  getDetailBasicInformationPropertyConstructions(
    id: number | undefined
  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url} ${envi.unitBuilt} ${envi.schemas.temp}/${id}`;

    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }

  getDetailBasicInformationPropertyCalificationConstructions(
    unitBuiltId: number | undefined
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
    id: string
  ): Observable<ZoneBAUnitResponse[]> {
    const url = `${this.basic_url}${envi.baUnitZona_baunitId}`;

    let params: HttpParams = new HttpParams();
    params = params.append('baunitId', `${id}`);

    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  getByBaunitFisica(
    id: string,
    schema: string,
    executionId?: string | null
  ): Observable<ZoneBAUnitResponse[]> {
    let url;
    if (executionId) {
      url = `${this.basic_url}${envi.baUnitZona}${envi.baunitIdFisicas}/${schema}/${executionId}/${id}`;
    } else {
      url = `${this.basic_url}${envi.baUnitZona}${envi.baunitIdFisicas}/${schema}/${id}`;
    }

    return this.http
      .get<ZoneBAUnitResponse[]>(url)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }

  getByBaunitEcono(
    id: string,
    schema: string,
    executionId?: string | null
  ): Observable<ZoneBAUnitResponse[]> {
    let url;
    if (executionId) {
      url = `${this.basic_url}${envi.baUnitZona}${envi.baunitIdEcono}/${schema}/${executionId}/${id}`;
    } else {
      url = `${this.basic_url}${envi.baUnitZona}${envi.baunitIdEcono}/${schema}/${id}`;
    }

    return this.http
      .get<ZoneBAUnitResponse[]>(url)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }
  getByDivPolUrbana(
    divpolLv1: string,
    divpolLv2: string
  ): Observable<UrbanPhysicalZone[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('divpolLv1', `${divpolLv1}`);
    params = params.append('divpolLv2', `${divpolLv2}`);

    const url = `${this.basic_url}${envi.ccZonaHomoFisicaUr}${envi.divpol}`;

    console.log('url', url);

    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  getByDivPolRural(
    divpolLv1: string,
    divpolLv2: string
  ): Observable<RuralPhysicalZone[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('divpolLv1', `${divpolLv1}`);
    params = params.append('divpolLv2', `${divpolLv2}`);
    const url = `${this.basic_url}${envi.ccZonaHomoFisicaRu}${envi.divpol}`;

    console.log('url', url);
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  getByDivPolGeoeconomica(
    divpolLv1: string,
    divpolLv2: string
  ): Observable<GeoEconomicZone[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('divpolLv1', `${divpolLv1}`);
    params = params.append('divpolLv2', `${divpolLv2}`);
    const url = `${this.basic_url}${envi.ccZonaHomoGeoEconomica}${envi.divpol}`;

    console.log('url', url);
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  createBAUnitZones(
    body: CreateBaunitZone,
    baunitId: number,
    changeLogId: string
  ): Observable<ZoneBAUnitResponse> {
    const url = `${this.basic_url}${envi.baUnitZona}/${envi.schemas.temp}/${changeLogId}/${baunitId}`;

    return this.http.post<ZoneBAUnitResponse>(url, body);
  }

  updateBAUnitZones(
    exeuctionId: string,
    baunitId: number,
    baUnitZonaId: number,
    body: CreateBaunitZone
  ): Observable<ZoneBAUnitResponse> {
    const url = `${this.basic_url}${envi.baUnitZona}/${envi.schemas.temp}/${exeuctionId}/${baunitId}/${baUnitZonaId}`;

    return this.http.put<ZoneBAUnitResponse>(url, body);
  }

  deleteBAUnitZones(
    executionId: string,
    baunitId: number,
    baUnitZonaId: number
  ): Observable<void> {
    const url = `${this.basic_url}${envi.baUnitZona}/${envi.schemas.temp}/${executionId}/${baunitId}/${baUnitZonaId}`;

    return this.http.delete<void>(url);
  }

  /**
   * Update basic information address
   *
   * @param updateBasicInformationAddress
   * @param baunitId
   * @returns
   */
  updateBasicInformationPropertyAddress(
    baunitId: string,
    schema: string,
    executionId: string,
    updateBasicInformationAddress: Partial<DetailBasicInformationAddress>
  ): Observable<DetailBasicInformationAddress> {
    //            {{url}}:{{port}}/ccDireccion/temp/{{executionId}}/{{baunitId}}
    const url = `${this.basic_url}${envi.ccDireccion}/${schema}/${executionId}/${baunitId}`;

    return this.httpClient.put<DetailBasicInformationAddress>(
      url,
      updateBasicInformationAddress
    );
  }

  updateBasicInformationPropertyConstruction(
    id: string,
    updateBasicInformationConstruction: Partial<ContentInformationConstruction>
  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url}${envi.ccDireccion}/${id}`;
    return this.httpClient.put<ContentInformationConstruction>(
      url,
      updateBasicInformationConstruction
    );
  }

  updateConstruction(
    executionId: number,
    baunitId: number,
    data: any
  ): Observable<any> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}`;
    console.log('data', data);
    return this.http.put(url, data);
  }

  updateBasicInformationProperty(
    executionId: string,
    baunitId: string,
    body: UpdateBasicInformationProperty
  ): Observable<BasicInformationProperty> {
    const url = `${this.basic_url}/${envi.baunit}/temp/${executionId}/${baunitId}`;

    return this.http.put<BasicInformationProperty>(url, body).pipe(
      catchError((error) => {
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
    schema: string,
    executionId: string,
    createBasicInformationAddress: CreateBasicInformationAddress
  ): Observable<DetailBasicInformationAddress> {

    const url = `${this.basic_url}${envi.ccDireccion}/${schema}/${executionId}/${baunitId}`;

    return this.httpClient.post<DetailBasicInformationAddress>(
      url,
      createBasicInformationAddress,
    );
  }

  createBasicInformationPropertyConstruction(
    executionId: string,
    baunitId: string,
    createBasicInformationConstruction: CreateBasicInformationConstruction
  ): Observable<ContentInformationConstruction> {
    const url = `${this.basic_url}${envi.unitBuilt}/${envi.schemas.temp}/${executionId}/${baunitId}`;

    return this.http
      .post<ContentInformationConstruction>(
        url,
        createBasicInformationConstruction
      )
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

  updateCalification(
    executionId: string,
    baunitId: string,
    constructionId: number,
    payload: { ccCalUBDom: { id: number } }[]
  ): Observable<void> {
    const url = `${this.basic_url}${envi.calificationUB}${envi.unitBuild}/${envi.schemas.temp}/${executionId}/${baunitId}/${constructionId}`;
    return this.http.put<void>(url, payload);
  }

  /**
   * Delete basic information by direccionId
   * @param id
   * @returns
   */
  deleteBasicInformationPropertyAddress(
    direccionId: string,
    baunitId: string,
    schema: string,
    executionId: string,
  ): Observable<any> {
    //            {{url}}:{{port}}/ccDireccion/temp/{{executionId}}/{{baunitId}}/{{direccionId}}
    const url = `${this.basic_url}${envi.ccDireccion}/${schema}/${executionId}/${baunitId}/${direccionId}`;

    return this.httpClient.delete(url);
  }

  deleteBasicInformationPropertyConstruction(
    constructionId: string
  ): Observable<any> {
    const url = `${this.basic_url}${envi.ccDireccion}/${constructionId}`;
    const httpParams: HttpParams = new HttpParams().set('version', '9999999');
    return this.httpClient.delete(url, { params: httpParams });
  }

  deleteConstruction(
    baunitId: string,
    changeLogId: string,
    unitBuiltId: number
  ): Observable<any> {
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
