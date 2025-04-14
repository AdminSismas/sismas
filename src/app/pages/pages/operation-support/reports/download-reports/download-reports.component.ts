import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  Output,
  ViewChild,
  OnInit,
  AfterViewInit
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// import { PAGE_OPTION_10_20_50_100 } from 'src/app/apps/constants/constant';
// import { USER_COLUMNS } from 'src/app/apps/constants/users.constants';
// import { Content } from 'src/app/apps/interfaces/users/user';
import { DownloadReportsService } from '../../../../../apps/services/operation-support/reports/download-reports.service';
import { DownloadReport } from '../../../../../apps/interfaces/operation-support/reports/report.interface';
import {
  MatDatepickerInputEvent,
  MatDatepickerModule
} from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import * as XLSX from 'xlsx';
import { saveAs } from 'file-saver';
import { MatDialogModule } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';

// import * as FileSaver from 'file-saver';

@Component({
  selector: 'vex-download-reports',
  standalone: true,
  imports: [
    MatIconModule,
    CommonModule,
    ReactiveFormsModule,
    /* Material */
    MatButtonModule,
    MatFormFieldModule,
    MatInputModule,
    MatTableModule,
    MatPaginatorModule,
    MatMenuModule,
    MatDatepickerModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule
    /* Custom */
  ],
  templateUrl: './download-reports.component.html',
  styleUrl: './download-reports.component.scss'
})
export class DownloadReportsComponent implements OnInit, AfterViewInit {
  @ViewChild(MatPaginator, { static: false }) paginator!: MatPaginator;
  @Input() categoryName: string | undefined;
  @Input() categoryId: number | undefined;
  @Output() backToMaster = new EventEmitter<void>();

  public displayedColumns: string[] = [
    'ficha',
    'fecha_registro',
    'area_catastral',
    'npn'
  ];
  public dataSource = new MatTableDataSource<DownloadReport>();
  public totalElements = 0;
  public page = 0;
  public pageSize = 10;
  public pageSizeOptions: number[] = [10, 20, 50, 100];

  public startDate = '';
  public endDate = '';
  public searchValue = '';
  public allReports: DownloadReport[] = [];
  public showError = false;

  constructor(private reportService: DownloadReportsService) {}

  ngOnInit(): void {
    this.getReports('2021-06-01', '2021-07-01');
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  getReports(startDate: string, endDate: string): void {
    this.reportService.getReports(startDate, endDate).subscribe({
      next: (data) => {
        this.dataSource.data = data;
        this.totalElements = data.length;

        setTimeout(() => {
          if (this.paginator) {
            this.paginator.length = this.totalElements;
            this.paginator.firstPage();
            this.dataSource.paginator = this.paginator;
          }
        });
      },
      error: (error) => {
        console.error('Error al obtener los reportes', error);
      }
    });
  }

  pageEvent(event: PageEvent): void {
    this.pageSize = event.pageSize;
    this.paginator.length = this.totalElements;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  updateDate(event: MatDatepickerInputEvent<Date>, type: 'start' | 'end') {
    if (event.value) {
      const dateStr = event.value.toISOString().split('T')[0]; // Formato YYYY-MM-DD

      if (type === 'start') {
        this.startDate = dateStr;
      } else {
        this.endDate = dateStr;
      }
    }
  }

  exportToExcel() {
    const dataToExport = this.dataSource.data.map((row: DownloadReport) => ({
      Ficha: row.ficha,
      'Fecha Registro': row.fecha_registro,
      'Área Catastral': row.area_catastral,
      NPN: row.npn
    }));

    const ws: XLSX.WorkSheet = XLSX.utils.json_to_sheet(dataToExport);

    const csvOutput = XLSX.utils.sheet_to_csv(ws, { FS: ',' });

    const blob = new Blob([csvOutput], { type: 'text/csv;charset=utf-8;' });
    saveAs(blob, 'reportes.csv');
  }

  searchReports() {
    if (this.startDate && this.endDate) {
      this.getReports(this.startDate, this.endDate);
    }
  }

  goBack() {
    this.backToMaster.emit();
  }

  get isExportDisabled(): boolean {
    return !this.dataSource?.data?.length;
  }

  get isSearchDisabled(): boolean {
    return !this.startDate || !this.endDate;
  }
}
