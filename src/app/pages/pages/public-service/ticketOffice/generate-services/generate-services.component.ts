import { Component } from '@angular/core';
import { InConstructionComponent } from '../../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { CertificateGridComponent } from './certificate-grid/certificate-grid.component';

@Component({
  selector: 'vex-generate-services',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    CertificateGridComponent
  ],
  templateUrl: './generate-services.component.html',
  styleUrl: './generate-services.component.scss'
})
export class GenerateServicesComponent {

}
