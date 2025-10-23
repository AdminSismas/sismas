import { Component } from '@angular/core';
import {
  InConstructionComponent
} from '@shared/components';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';

@Component({
  selector: 'vex-integral-economic-mod',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent
  ],
  templateUrl: './integral-economic-mod.component.html',
  styleUrl: './integral-economic-mod.component.scss'
})
export class IntegralEconomicModComponent {

}
