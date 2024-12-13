import { Component } from '@angular/core';
import { InConstructionComponent } from '../../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { TableWorkFinishedComponent } from 'src/app/apps/components/table-work-finished/table-work-finished.component';

@Component({
  selector: 'vex-work-finished',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    TableWorkFinishedComponent
  ],
  templateUrl: './work-finished.component.html',
  styleUrl: './work-finished.component.scss'
})
export class WorkFinishedComponent {

}
