/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component,Input, DestroyRef,inject, OnInit, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutHeaderDirective } from "../../../../../@vex/components/vex-page-layout/vex-page-layout-header.directive";
import { FormsModule, ReactiveFormsModule, } from '@angular/forms';
import { NgClass, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import {RULE_PAGE_CADASTRAL_DA, TITULO_PAGE_CADASTRAL_DA } from 'src/app/apps/constants/constant';

import { CurrencyLandsPipe } from 'src/app/apps/pipes/currency-lands.pipe';
import { TableCadastralSearchComponent } from 'src/app/apps/components/table-cadastral-search/table-cadastral-search.component';

@Component({
  selector: 'vex-cadastral-search-da',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    VexPageLayoutComponent,
    MatButtonToggleModule,
    TableCadastralSearchComponent
],
  templateUrl: './cadastral-search-da.component.html',
  styleUrl: './cadastral-search-da.component.scss'
})
export class CadastralSearchDAComponent  {

  titlePage: string = TITULO_PAGE_CADASTRAL_DA;
  rulePage: string = RULE_PAGE_CADASTRAL_DA;

  
}
