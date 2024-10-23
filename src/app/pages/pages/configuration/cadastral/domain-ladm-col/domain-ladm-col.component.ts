import { Component } from '@angular/core';
import { InConstructionComponent } from '../../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { TableDomainLadmColComponent } from "../../../../../apps/components/table-domain-ladm-col/table-domain-ladm-col.component";

@Component({
  selector: 'vex-domain-ladm-col',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    TableDomainLadmColComponent
],
  templateUrl: './domain-ladm-col.component.html',
  styleUrl: './domain-ladm-col.component.scss'
})
export class DomainLADMCOLComponent {

}
