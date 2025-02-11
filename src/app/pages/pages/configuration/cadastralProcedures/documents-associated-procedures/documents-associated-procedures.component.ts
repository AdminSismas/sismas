import { Component, DestroyRef, inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { InConstructionComponent } from '../../../../../apps/components/general-components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { PageSearchData } from '../../../../../apps/interfaces/general/page-search-data.model';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BaunitHead } from 'src/app/apps/interfaces/information-property/baunit-head.model';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { InformationPegeable } from '../../../../../apps/interfaces/general/information-pegeable.model';
import {  MatTableModule } from '@angular/material/table';
import {  MatDialogModule, } from '@angular/material/dialog';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { CommonModule, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
@Component({
  selector: 'vex-documents-associated-procedures',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    InConstructionComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    MatTableModule,
    SweetAlert2Module,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule ,
    MatSortModule,
    MatTableModule,
    NgFor,
    NgClass,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule,
  ],
  templateUrl: './documents-associated-procedures.component.html',
  styleUrl: './documents-associated-procedures.component.scss'
})
export class DocumentsAssociatedProceduresComponent {


}
