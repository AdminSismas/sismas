import { Component } from '@angular/core';
import { InConstructionComponent } from '../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexPageLayoutHeaderDirective } from "../../../../../@vex/components/vex-page-layout/vex-page-layout-header.directive";
import { CommentsComponent } from "../../../../apps/components/comments/comments.component";

@Component({
  selector: 'vex-cadastral-search-da',
  standalone: true,
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    VexPageLayoutHeaderDirective,
    CommentsComponent
],
  templateUrl: './cadastral-search-da.component.html',
  styleUrl: './cadastral-search-da.component.scss'
})
export class CadastralSearchDAComponent {

}
