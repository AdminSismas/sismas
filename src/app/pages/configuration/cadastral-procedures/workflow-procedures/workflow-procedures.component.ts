// Angular framework
import { Component } from '@angular/core';

// Vex
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';

// Material
import { MatIconModule } from '@angular/material/icon';

// Custom
import { TableWorkflowComponent } from '@features/bpm-workflows/components/workflow/table-workflow.component';

@Component({
  selector: 'vex-workflow-procedures',
  standalone: true,
  imports: [
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
