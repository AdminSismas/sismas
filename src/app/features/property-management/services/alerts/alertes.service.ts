
import { inject, Injectable } from '@angular/core';
import { environment as envi } from '@environments/environments';
import { BehaviorSubject, catchError, Observable, Subject, EMPTY } from 'rxjs';
import { HttpClient, HttpParams, HttpErrorResponse } from '@angular/common/http';
import { AlertResponse } from '@features/property-management/models/alerts.interface';

@Injectable({
  providedIn: 'root'
})
export class AlertsService {
  basic_url = `${envi.url}:${envi.port}`;

  private http = inject(HttpClient);

  reloadTable$ = new Subject<boolean>();
  reloadTableStarted$: Observable<boolean> = this.reloadTable$.asObservable();

  showOptionsPerson$ = new BehaviorSubject<boolean>(false);
  showOptionsPersonStarted$: Observable<boolean> =
    this.showOptionsPerson$.asObservable();




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
  getAlertsByBaunitId(baunitId: string): Observable<AlertResponse[]> {
    let params: HttpParams = new HttpParams();
    params = params.append('baunitId', baunitId);
    const url = `${this.basic_url}/alert/baunitId`;
    return this.http
      .get<AlertResponse[]>(url, { params })
      .pipe(catchError((error: HttpErrorResponse) => {
        if (error.status === 404) {
          return EMPTY;
        }
        throw error;
      }));
  }

  createAlertByBaunitId(
    baunitId: string,
    executionId: string,
    body: Partial<AlertResponse>
  ): Observable<AlertResponse> {
    const url = `${this.basic_url}/alert/temp/${executionId}/${baunitId}`;

    return this.http.post<AlertResponse>(url, body );
  }

  updateAlertByBaunitId(
    baunitId: string,
    executionId: string,
    id: string,
    body: Partial<AlertResponse>
  ): Observable<AlertResponse> {
    const url = `${this.basic_url}/alert/temp/${executionId}/${baunitId}/${id}`;

    return this.http.put<AlertResponse>(url, body);
  }
}
