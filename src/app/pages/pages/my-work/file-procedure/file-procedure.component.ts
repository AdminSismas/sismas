import { Component } from '@angular/core';
import { InConstructionComponent } from '../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'vex-file-procedure',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    MatButtonModule
  ],
  templateUrl: './file-procedure.component.html',
  styleUrl: './file-procedure.component.scss'
})
export class FileProcedureComponent {

}
