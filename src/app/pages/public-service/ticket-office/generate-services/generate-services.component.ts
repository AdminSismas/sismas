import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { CertificateGridComponent } from '@features/public-services/components/ticket-office/general-services/certificate-grid/certificate-grid.component';
import { ProcedureStateTableComponent } from "@features/public-services/components/ticket-office/general-services/procedure-state-table/procedure-state-table.component";
import { MatTabsModule } from '@angular/material/tabs';

@Component({
  selector: 'vex-generate-services',
  standalone: true,
  host: { class: 'h-screen' },
  imports: [
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    CertificateGridComponent,
    ProcedureStateTableComponent,
    MatTabsModule
],
  templateUrl: './generate-services.component.html',
  styleUrl: './generate-services.component.scss'
})
export class GenerateServicesComponent {

}
