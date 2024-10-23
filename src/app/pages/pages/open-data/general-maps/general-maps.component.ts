import { Component } from '@angular/core';
import { InConstructionComponent } from '../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { DocumnetManagementComponent } from "../../../../apps/components/documnet-management/documnet-management.component";

@Component({
  selector: 'vex-general-maps',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    DocumnetManagementComponent
],
  templateUrl: './general-maps.component.html',
  styleUrl: './general-maps.component.scss'
})
export class GeneralMapsComponent {

}
