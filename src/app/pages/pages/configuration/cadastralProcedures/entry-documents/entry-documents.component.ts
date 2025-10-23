import { Component } from '@angular/core';
import {
  InConstructionComponent
} from '@shared/components';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';

@Component({
  selector: 'vex-entry-documents',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent
  ],
  templateUrl: './entry-documents.component.html',
  styleUrl: './entry-documents.component.scss'
})
export class EntryDocumentsComponent {

}
