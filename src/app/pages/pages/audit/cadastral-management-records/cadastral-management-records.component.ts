import { Component } from '@angular/core';
import { InConstructionComponent } from 'src/app/apps/components/general-components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { MatIconButton } from '@angular/material/button';

@Component({
  selector: 'vex-cadastral-management-records',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    MatIconButton
  ],
  templateUrl: './cadastral-management-records.component.html',
  styleUrl: './cadastral-management-records.component.scss'
})
export class CadastralManagementRecordsComponent {

}
