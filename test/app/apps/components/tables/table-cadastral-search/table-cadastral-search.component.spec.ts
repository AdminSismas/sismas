import { ComponentFixture, TestBed } from '@angular/core/testing';

import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableModule } from '@angular/material/table';
import { MatSortModule } from '@angular/material/sort';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { InfoTableService } from '../../../../../../src/app/apps/services/general/info-table.service';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { TableCadastralSearchComponent } from 'src/app/apps/components/tables/table-cadastral-search/table-cadastral-search.component';

describe(TableCadastralSearchComponent.name, () => {
  let component: TableCadastralSearchComponent;
  let fixture: ComponentFixture<TableCadastralSearchComponent>;
  let compiled: HTMLElement;
  let infoTableService: InfoTableService;
  let service: VexLayoutService;
  let httpMock: HttpTestingController;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        TableCadastralSearchComponent,
        VexPageLayoutComponent,
        VexPageLayoutHeaderDirective,
        VexBreadcrumbsComponent,
        MatButtonToggleModule,
        ReactiveFormsModule,
        VexPageLayoutContentDirective,
        NgIf,
        MatButtonModule,
        MatTooltipModule,
        MatIconModule,
        MatMenuModule,
        MatTableModule,
        MatSortModule,
        MatCheckboxModule,
        NgFor,
        NgClass,
        MatPaginatorModule,
        FormsModule,
        MatDialogModule,
        MatInputModule
      ],
      providers: [InfoTableService,VexLayoutService, MatDialog]
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(TableCadastralSearchComponent);
    component = fixture.componentInstance;
    infoTableService = TestBed.inject(InfoTableService);
    service = TestBed.inject(VexLayoutService);
    httpMock = TestBed.inject(HttpTestingController);

    fixture.detectChanges();
    compiled = fixture.nativeElement;
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });

});
