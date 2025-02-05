import { Component } from '@angular/core';
import { InConstructionComponent } from '../../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { TableProceduresComponent } from 'src/app/apps/components/table-procedures/table-procedures.component';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'vex-work-finished',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    TableProceduresComponent
  ],
  templateUrl: './work-finished.component.html',
  styleUrl: './work-finished.component.scss'
})
export class WorkFinishedComponent {
  urlMain = environment.finish;

}
