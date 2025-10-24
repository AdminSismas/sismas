import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { SendGeneralRequestsService } from '@shared/services';
import { Observable } from 'rxjs';
import { DownloadReport } from '@shared/interfaces';


@Injectable({
  providedIn: 'root'
})
export class DownloadReportsService {

  private apiUrl = 'https://dev.api.cic-ware.com/reportes/consultas.php';

  constructor(
    private http: HttpClient,
    private requestsService: SendGeneralRequestsService
  ) { }

  getReports(startDate: string, endDate: string): Observable<DownloadReport[]> {
    const params = new HttpParams()
      .set('start_date', startDate)
      .set('end_date', endDate);

    return this.http.get<DownloadReport[]>(this.apiUrl, { params });
  }
}
