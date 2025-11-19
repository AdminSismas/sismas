import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { TableProceduresComponent } from '@features/bpm-workflows/components/procedures/table-procedures.component';
import { environment } from '@environments/environments';

@Component({
  selector: 'vex-work-historical',
  standalone: true,
  imports: [
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
