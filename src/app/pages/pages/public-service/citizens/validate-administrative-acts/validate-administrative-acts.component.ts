import { Component } from '@angular/core';
import { InConstructionComponent } from '@shared/utils/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';

@Component({
  selector: 'vex-validate-administrative-acts',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent
  ],
  templateUrl: './validate-administrative-acts.component.html',
  styleUrl: './validate-administrative-acts.component.scss'
})
export class ValidateAdministrativeActsComponent {

}
