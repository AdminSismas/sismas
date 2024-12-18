// Angular framework
import { Component } from '@angular/core';

// Vex
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';

// Material
import { MatIconModule } from '@angular/material/icon';
import { TableDigitalizedSignaturesComponent } from 'src/app/apps/components/configuration/digitalized-signatures/table-digitalized-signatures.component';
import { MatButtonModule } from '@angular/material/button';

// Custom

@Component({
  selector: 'vex-digitalized-signatures',
  standalone: true,
  imports: [
    // Vex
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    VexPageLayoutHeaderDirective,

    // Material
    MatIconModule,
    MatButtonModule,

    // Custom
    TableDigitalizedSignaturesComponent
  ],
  templateUrl: './digitalized-signatures.component.html',
  styleUrl: './digitalized-signatures.component.scss'
})
export class DigitalizedSignaturesComponent {

}
