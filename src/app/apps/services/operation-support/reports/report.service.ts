import { Injectable } from '@angular/core';
import { ReportCategory } from '@shared/interfaces';

import { Observable, of } from 'rxjs';
import { DownloadReport } from '@shared/interfaces';

@Injectable({
  providedIn: 'root'
})
export class ReportService {
  private categories: ReportCategory[] = [
    { id: 1, name: 'REPORTE CONTRALORÍA R1', status: 'ERROR', statusDate: '11-02-2025', outputFormat: 'CSV' },
    { id: 2, name: 'REPORTE CONTRALORÍA R2', status: 'FINALIZADO', statusDate: '12-02-2025', outputFormat: 'CSV' },
    { id: 3, name: 'REPORTE TRÁMITES PENDIENTES', status: 'FINALIZADO', statusDate: '13-02-2025', outputFormat: 'CSV' },
    { id: 4, name: 'REPORTE TRÁMITES FINALIZADOS', status: 'FINALIZADO', statusDate: '13-02-2025', outputFormat: 'CSV' },
    { id: 4, name: 'REPORTE MINISTERIOS', status: 'FINALIZADO', statusDate: '13-02-2025', outputFormat: 'CSV' },
  ];

  private reports: DownloadReport[] = [
    { id: 1, ficha: 'F001', fecha_registro: '12-02-2024', area_catastral: 100, npn: '1234', categoryId: 1 },
    { id: 2, ficha: 'F002', fecha_registro: '10-02-2024', area_catastral: 200, npn: '5678', categoryId: 1 },
    { id: 3, ficha: 'F003', fecha_registro: '08-02-2024', area_catastral: 150, npn: '9101', categoryId: 2 }
  ];

  getCategories(): Observable<ReportCategory[]> {
    return of(this.categories);
  }

  getReportsByCategory(categoryId: number): Observable<DownloadReport[]> {
    return of(this.reports.filter(report => report.categoryId === categoryId));
  }
}
