import { inject, Injectable } from '@angular/core';

import { Observable, of } from 'rxjs';
import { DownloadReport } from '@features/operation-support/models/reports';
import { HttpClient } from '@angular/common/http';
import { environment as envi } from '@environments/environments';

export interface ReportType {
  id: number;
  name: string;
  municipality?: string;
  outputFormat: string;
  urlEnd: string;
}

@Injectable({
  providedIn: 'root'
})
export class ReportManagerService {
  private baseCategories: ReportType[] = [
    { id: 1, name: 'Procesos Activos', outputFormat: 'XLSX', urlEnd: 'PROCESOS_ACTIVOS' },
    { id: 2, name: 'Procesos Finalizados', outputFormat: 'XLSX', urlEnd: 'PROCESOS_FINALIZADOS' },
    // { id: 3, name: 'Actualización urbana', outputFormat: 'XLSX', urlEnd: 'ACTUALIZACION_URBANA' },
    // { id: 4, name: 'Actualización rural', outputFormat: 'XLSX', urlEnd: 'ACTUALIZACION_RURAL' },
  ];

  private reports: DownloadReport[] = [
    {
      id: 1,
      ficha: 'F001',
      fecha_registro: '12-02-2024',
      area_catastral: 100,
      npn: '1234',
      categoryId: 1
    },
    {
      id: 2,
      ficha: 'F002',
      fecha_registro: '10-02-2024',
      area_catastral: 200,
      npn: '5678',
      categoryId: 1
    },
    {
      id: 3,
      ficha: 'F003',
      fecha_registro: '08-02-2024',
      area_catastral: 150,
      npn: '9101',
      categoryId: 2
    }
  ];

  private readonly base_url = `${envi.url}:${envi.port}`;

  private http = inject(HttpClient);

  getCategories(municipalities: string[]): Observable<ReportType[]> {
    const categories: ReportType[] = municipalities.flatMap((municipality) => {
        return this.baseCategories.map((category) => ({
          ...category,
          municipality: municipality
        }));
      });

    return of(categories);
  }

  getReportsByCategory(categoryId: number): Observable<DownloadReport[]> {
    return of(
      this.reports.filter((report) => report.categoryId === categoryId)
    );
  }

  getExcelReport(urlEnd: string, municipality: string) {
    const url = `${this.base_url}${envi.export}${envi.proexecution}/${municipality}/${urlEnd}`;

    return this.http.get(url, {
      observe: 'response',
      responseType: 'blob'
    });
  }

  getUpdateReport(municipality: string, department: string, zoneType: 'rural' | 'urbano') {
    const { export: exportPath, actualizacionesMultiples } = envi;
    const url = `${this.base_url}${exportPath}${actualizacionesMultiples}/${department}${municipality}/${zoneType}`;

    return this.http.get(url, {
      observe: 'response',
      responseType: 'blob'
    });
  }
}
