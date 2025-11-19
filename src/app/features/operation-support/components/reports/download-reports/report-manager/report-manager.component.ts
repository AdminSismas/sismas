import { Component, signal } from '@angular/core';
import { ReportCategory } from '@features/operation-support/models/reports';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { DownloadReportsComponent } from '@pages/operation-support/reports/download-reports/download-reports.component';
import { ReportMasterComponent } from "../report-master/report-master.component";

@Component({
  selector: 'vex-report-manager',
  standalone: true,
  imports: [
    /* Material */
    /* Vex */
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    /* Custom */
    DownloadReportsComponent,
    ReportMasterComponent
],
  templateUrl: './report-manager.component.html',
  styleUrl: './report-manager.component.scss'
})
export class ReportManagerComponent {
  selectedCategory = signal<ReportCategory | null>(null);

  viewDetail = signal<boolean>(false);

  goBack() {
    this.viewDetail.set(false); // Regresa a la vista maestra
    this.selectedCategory.set(null);
  }
}
