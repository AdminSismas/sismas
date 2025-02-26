/* eslint-disable @typescript-eslint/no-explicit-any */
import { inject, Injectable } from '@angular/core';
import { environment as envi } from '../../../../environments/environments';
import { SendGeneralRequestsService } from '../general/send-general-requests.service';
import { BehaviorSubject, catchError, Observable, Subject } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root',
})
export class AlertsService {
  basic_url = `${envi.url}:${envi.port}`;
  private httpClient = inject(HttpClient);

  reloadTable$ = new Subject<boolean>();
  reloadTableStarted$: Observable<boolean> = this.reloadTable$.asObservable();

  showOptionsPerson$ = new BehaviorSubject<boolean>(false);
  showOptionsPersonStarted$: Observable<boolean> = this.showOptionsPerson$.asObservable();

  constructor(private requestsService: SendGeneralRequestsService, private http: HttpClient) {}

  public reloadTableSet(value: boolean): void {
    this.reloadTable$.next(value);
  }

  public showOptionsPersonSet(value: boolean): void {
    this.showOptionsPerson$.next(value);
  }

  /**
   * @param baunitId
   * @returns
   */
  getAlertsByBaunitId(baunitId: string): Observable<any[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('baunitId', baunitId);
    const url = `${this.basic_url}/alert/baunitId`;
    return this.http.get<any[]>(url, { params }).pipe(
      catchError((error) => this.requestsService.errorNotFound(error))
    );
  }
}
