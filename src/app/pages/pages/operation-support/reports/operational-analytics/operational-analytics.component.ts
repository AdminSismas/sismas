import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { InConstructionComponent } from '@shared/utils/in-construction/in-construction.component';

@Component({
  selector: 'vex-operational-analytics',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent
  ],
  templateUrl: './operational-analytics.component.html',
  styleUrl: './operational-analytics.component.scss'
})
export class OperationalAnalyticsComponent {

}
