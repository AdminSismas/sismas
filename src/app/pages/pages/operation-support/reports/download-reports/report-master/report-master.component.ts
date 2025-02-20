import { Component, SimpleChanges, ViewChild } from '@angular/core';
import { ReportCategory } from '../interfaces/report-category.interface';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ReportService } from '../services/report.service';
import { DownloadReport } from '../interfaces/report.interface';
import { InConstructionComponent } from 'src/app/apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCardModule } from '@angular/material/card';
import { MatToolbar } from '@angular/material/toolbar';
import { MatDialogModule } from '@angular/material/dialog';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { DownloadReportsComponent } from '../download-reports.component';

@Component({
  selector: 'vex-report-master',
  standalone: true,
  imports: [
    InConstructionComponent,
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
    MatToolbar,
    MatDialogModule,
  
    /* Vex */
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    VexPageLayoutHeaderDirective,
    /* Custom */
    DownloadReportsComponent
  ],
  templateUrl: './report-master.component.html',
  styleUrl: './report-master.component.scss'
})
export class ReportMasterComponent {
  public categories: ReportCategory[] = [];
  public displayedColumns: string[] = ['action', 'id', 'name', 'status', 'statusDate', 'outputFormat'];
  public dataSource: MatTableDataSource<ReportCategory> = new MatTableDataSource<ReportCategory>();

  public selectedCategory: ReportCategory | null = null;
  public displayedReportColumns: string[] = ['ficha', 'fecha_registro', 'area_catastral', 'npn'];
  public reportDataSource: MatTableDataSource<DownloadReport> = new MatTableDataSource<DownloadReport>();

  public viewMode: 'master' | 'detail' = 'master';

  @ViewChild('categoryPaginator', { static: false }) categoryPaginator!: MatPaginator;
  @ViewChild('reportPaginator', { static: true }) reportPaginator!: MatPaginator;

  constructor(private reportService: ReportService) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  ngAfterViewInit() {
    setTimeout(() => {
      this.dataSource.paginator = this.categoryPaginator;
    });
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['viewMode'] && this.viewMode === 'master') {
      setTimeout(() => {
        this.dataSource.paginator = this.categoryPaginator;
      });
    }
  }

  loadCategories() {
    this.reportService.getCategories().subscribe(categories => {
      this.dataSource.data = categories;
      setTimeout(() => {
        this.dataSource.paginator = this.categoryPaginator;
      });
    });
  }

  selectCategory(category: ReportCategory) {
    this.selectedCategory = category;
    this.reportService.getReportsByCategory(category.id).subscribe(reports => {
      this.reportDataSource = new MatTableDataSource(reports);
      this.reportDataSource.paginator = this.reportPaginator;
      this.viewMode = 'detail'; // Cambia la vista a la tabla de reportes
    });
  }

  goBack() {
    this.viewMode = 'master'; // Regresa a la vista maestra
    this.selectedCategory = null;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value.trim().toLowerCase();
    this.dataSource.filter = filterValue;
  }
}
