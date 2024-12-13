// Angular framework
import { Component } from '@angular/core';

// Vex
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';

// Material
import { MatIconModule } from '@angular/material/icon';
import { TableDigitalizedSignaturesComponent } from 'src/app/apps/components/configuration/digitalized-signatures/table-digitalized-signatures.component';

// Custom

@Component({
  selector: 'vex-digitalized-signatures',
  standalone: true,
  imports: [
    // Vex
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,

    // Material
    MatIconModule,

    // Custom
    TableDigitalizedSignaturesComponent
  ],
  templateUrl: './digitalized-signatures.component.html',
  styleUrl: './digitalized-signatures.component.scss'
})
export class DigitalizedSignaturesComponent {

}
