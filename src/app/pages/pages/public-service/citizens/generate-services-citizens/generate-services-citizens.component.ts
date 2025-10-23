import { Component } from '@angular/core';
import { InConstructionComponent } from '@shared/components';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';

@Component({
  selector: 'vex-generate-services',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent
  ],
  templateUrl: './generate-services-citizens.component.html',
  styleUrl: './generate-services-citizens.component.scss'
})
export class GenerateServicesCitizensComponent {

}
