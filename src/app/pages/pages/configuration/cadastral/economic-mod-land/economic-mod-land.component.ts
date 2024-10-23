import { Component } from '@angular/core';
import { InConstructionComponent } from '../../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';

@Component({
  selector: 'vex-economic-mod-land',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent
  ],
  templateUrl: './economic-mod-land.component.html',
  styleUrl: './economic-mod-land.component.scss'
})
export class EconomicModLandComponent {

}
