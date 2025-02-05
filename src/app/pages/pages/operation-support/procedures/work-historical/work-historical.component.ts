import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { InConstructionComponent } from 'src/app/apps/components/in-construction/in-construction.component';
import { TableProceduresComponent } from 'src/app/apps/components/table-procedures/table-procedures.component';
import { environment } from 'src/environments/environments';

@Component({
  selector: 'vex-work-historical',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    TableProceduresComponent
  ],
  templateUrl: './work-historical.component.html',
  styleUrl: './work-historical.component.scss'
})
export class WorkHistoricalComponent {
urlMain = environment.active;
}
