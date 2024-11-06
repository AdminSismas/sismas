import { inject, Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { catchError, Observable } from 'rxjs';
import { BasicInformationProperty } from '../../interfaces/information-property/basic-information-property';
import { InformationPegeable } from '../../interfaces/information-pegeable.model';
import { HttpClient, HttpParams } from '@angular/common/http';
import { BasicInformationAddress } from '../../interfaces/information-property/basic-information-address';
import { CreateBasicInformationAddress, DetailBasicInformationAddress } from '../../interfaces/information-property/detail-basic-information-address';
import { InfoOwners } from '../../interfaces/information-property/info-owners';
import { PageSearchData } from '../../interfaces/page-search-data.model';
import { ContentInformationConstruction } from '../../interfaces/information-property/content-information-construction';
import { CcCalificacionUB } from '../../interfaces/information-property/cc-calificacion-ub';
import { ZoneBAUnit } from '../../interfaces/information-property/zone-baunit';

@Injectable({
  providedIn: 'root'
})
export class InformationPropertyService {
  basic_url: string = `${envi.url}:${envi.port}`;
  private httpClient = inject(HttpClient);

  constructor(private requestsService: SendGeneralRequestsService) {}

  getBasicInformationProperty(
    schema: string,
    id: string,
    executionId: string | null | undefined = null
  ): Observable<BasicInformationProperty> {
    let url: string = `${this.basic_url}${envi.baunit}${schema}`;
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
    const url: string = `${this.basic_url}${envi.basicAddress}`;
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  getDetailBasicInformationPropertyAddresses(
    schema: string,
    id: string | undefined
  ): Observable<DetailBasicInformationAddress> {
    const url: string = `${this.basic_url}${envi.ccDireccion}${id}`;
    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }

  getInformationPropertyOwners(
    schema: string,
    id: string,
    executionId: string | null | undefined = null
  ): Observable<InfoOwners[]> {
    let url: string = `${this.basic_url}${envi.rrright}${schema}`;
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
    let url: string = `${this.basic_url}${envi.unitBuilt}/${schema}`;
    if (!executionId || (executionId && schema === `${envi.schemas.main}`)) {
      url += `/${page.searchData}`;
    } else {
      url += `/${executionId}/${page.searchData}`;
    }
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }

  getDetailBasicInformationPropertyConstructions(
    schema: string,
    id: number | undefined
  ): Observable<ContentInformationConstruction> {
    const url: string = `${this.basic_url}${envi.unitBuilt}/${id}`;
    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
  }

  getDetailBasicInformationPropertyCalificationConstructions(
    schema: string,
    unitBuiltId: number | undefined,
    baunitId: number | undefined
  ): Observable<CcCalificacionUB[]> {
    const url: string = `${this.basic_url}${envi.calificationUB}${envi.unitBuild}/${schema}/${baunitId}/${unitBuiltId}`;
    return this.requestsService
      .sendRequestsFetchGet(url)
      .pipe(catchError((error) => this.requestsService.errorNotFound(error)));
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
    let url: string = `${this.basic_url}${envi.valuation}${schema}`;
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
    let url: string = `${this.basic_url}${envi.baUnitZona_baunitId}`;
    return this.getData(url, params).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
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
    const url: string = `${this.basic_url}${envi.ccDireccion}${id}`;
    return this.httpClient.put<DetailBasicInformationAddress>(
      url,
      updateBasicInformationAddress
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
    const url: string = `${this.basic_url}${envi.ccDireccion}`;
    const httpParams: HttpParams = new HttpParams()
    .set('baunitId', baunitId);
    return this.httpClient.post<DetailBasicInformationAddress>(
      url,
      createBasicInformationAddress,
      { params: httpParams }
    );
  }

  /**
   * Delete basic information by direccionId
   * @param id
   * @returns
   */
  deleteBasicInformationPropertyAddress(direccionId: string): Observable<any> {
    const url: string = `${this.basic_url}${envi.ccDireccion}/${direccionId}`;
    const httpParams: HttpParams = new HttpParams()
    .set('version', '9999999');
    return this.httpClient.delete(url, { params: httpParams});
  }

  private getData(url: string, params: any): Observable<any> {
    return this.requestsService.sendRequestsGetOption(url, { params: params });
  }
}
