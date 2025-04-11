import { inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { DownloadReport } from '../../../interfaces/operation-support/reports/report.interface';
import { HttpClient } from '@angular/common/http';
import { environment as envi } from 'src/environments/environments';

interface ReportType {
  id: number;
  name: string;
  outputFormat: string;
  urlEnd: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportManagerService {
  private categories: ReportType[] = [
    { id: 1, name: 'activos San Vicente', outputFormat: 'XLSX', urlEnd: 'PROCESOS_ACTIVOS_SANVICENTE' },
    { id: 2, name: 'finalizados San Vicente', outputFormat: 'XLSX', urlEnd: 'PROCESOS_FINALIZADOS_SANVICENTE' },
    { id: 3, name: 'activos Retiro', outputFormat: 'XLSX', urlEnd: 'PROCESOS_ACTIVOS_RETIRO' },
    { id: 4, name: 'finalizados Retiro', outputFormat: 'XLSX', urlEnd: 'PROCESOS_FINALIZADOS_RETIRO' },
  ];

  private reports: DownloadReport[] = [
    { id: 1, ficha: 'F001', fecha_registro: '12-02-2024', area_catastral: 100, npn: '1234', categoryId: 1 },
    { id: 2, ficha: 'F002', fecha_registro: '10-02-2024', area_catastral: 200, npn: '5678', categoryId: 1 },
    { id: 3, ficha: 'F003', fecha_registro: '08-02-2024', area_catastral: 150, npn: '9101', categoryId: 2 }
  ];

  private readonly base_url = `${envi.url}:${envi.port}`;

  private http = inject(HttpClient);

  getCategories(): Observable<ReportType[]> {
    return of(this.categories);
  }

  getReportsByCategory(categoryId: number): Observable<DownloadReport[]> {
    return of(this.reports.filter(report => report.categoryId === categoryId));
  }

  getExcelReport(urlEnd: string) {
    const url = `${this.base_url}${envi.export}${envi.proexecution}/${urlEnd}`;

    return this.http.get(url, {
      observe: 'response', responseType: 'blob'
    });
  }
}
