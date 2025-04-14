import {
  Component,
  OnInit,
  ViewChild,
  Output,
  EventEmitter,
  AfterViewInit
} from '@angular/core';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatFormField } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReportCategory } from 'src/app/apps/interfaces/operation-support/reports/report-category.interface';
import { DownloadReport } from 'src/app/apps/interfaces/operation-support/reports/report.interface';
import { PAGE, PAGE_OPTION_1_5_10, PAGE_SIZE } from 'src/app/apps/constants/general/constants';
import { ReportManagerService } from 'src/app/apps/services/operation-support/reports/report-manager.service';

@Component({
  selector: 'vex-report-master',
  standalone: true,
  imports: [
    MatPaginatorModule,
    MatFormField,
    MatIconModule,
    MatInputModule,
    MatTableModule
  ],
  templateUrl: './report-master.component.html'
})
export class ReportMasterComponent implements OnInit, AfterViewInit {
  dataSource = new MatTableDataSource();
  displayedColumns: string[] = [
    'action',
    'id',
    'name',
    'outputFormat'
  ];
  reportDataSource: MatTableDataSource<DownloadReport> =
    new MatTableDataSource<DownloadReport>();

  // Paginator variables
  pageSize = PAGE_SIZE;
  page = PAGE;
  totalElements = 0;

  @Output() viewDetail = new EventEmitter<boolean>();
  @Output() selectedCategory = new EventEmitter<ReportCategory>();

  @ViewChild('categoryPaginator', { static: false })
  categoryPaginator!: MatPaginator;

  constructor(private reportManagerService: ReportManagerService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngAfterViewInit(): void {
    this.dataSource.paginator = this.categoryPaginator;
  }

  loadCategories() {
    this.reportManagerService.getCategories().subscribe({
      next: (categories) => {
        this.dataSource.data = categories;
        this.totalElements = categories.length;
      }
    });
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value
      .trim()
      .toLowerCase();
    this.dataSource.filter = filterValue;
  }

  selectCategory(urlEnd: string, name: string) {
    this.reportManagerService.getExcelReport(urlEnd)
      .subscribe({
        next: (response) => {
          const filename = name.toUpperCase() + '.xlsx';
          const type = response.headers.get('content-type') as string;
          this.downloadFile(response.body!, type, filename);
        }
      });
  }

  downloadFile(data: Blob, type: string, filename: string) {
    const blob = new Blob([data], {type: type});
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);
  }

  changePage(event: PageEvent) {
    console.log(event);
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.totalElements = event.length;
  }

  get paginatorOptions(): number[] {
    return PAGE_OPTION_1_5_10;
  }
}
