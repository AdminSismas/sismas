import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import {
  TableDomainLadmColComponent
} from '../../../../../apps/components/economic-mod-land/table-domain-ladm-col/table-domain-ladm-col.component';

@Component({
  selector: 'vex-domain-ladm-col',
  standalone: true,
  imports: [
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
