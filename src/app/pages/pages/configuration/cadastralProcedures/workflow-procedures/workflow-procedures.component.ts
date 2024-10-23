import { Component } from '@angular/core';
import { InConstructionComponent } from '../../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { TableWorkflowComponent } from "../../../../../apps/components/table-workflow/table-workflow.component";

@Component({
  selector: 'vex-workflow-procedures',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    TableWorkflowComponent
],
  templateUrl: './workflow-procedures.component.html',
  styleUrl: './workflow-procedures.component.scss'
})
export class WorkflowProceduresComponent {

}
