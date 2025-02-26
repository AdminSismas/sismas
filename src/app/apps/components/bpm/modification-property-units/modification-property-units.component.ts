// Angular Framework
import { Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { Observable } from 'rxjs';
// Material
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
// Vex
import { TableColumn } from '@vex/interfaces/table-column.interface';
// Custom
import { AlfaMainService } from 'src/app/apps/services/bpm/core/alfa-main.service';
import { CrudAlfaMainComponent } from '../crud-alfa-main/crud-alfa-main.component';
import { DataAlfaMain } from 'src/app/apps/interfaces/bpm/data-alfa-main.model';
import { InformationPegeable } from 'src/app/apps/interfaces/general/information-pegeable.model';
import { Operation } from 'src/app/apps/interfaces/bpm/operation';
import {
  LIST_SCHEMAS_CONTROL_CHANGES,
  MODAL_LARGE,
  PAGE,
  PAGE_OPTION__5_7_10,
  PAGE_SIZE,
  TYPEINFORMATION_EDITION,
  TYPEOPERATION_ADD,
  TYPEOPERATION_CREATE,
  TYPEOPERATION_DELETE
} from 'src/app/apps/constants/general/constant';
import { PageSearchData } from 'src/app/apps/interfaces/general/page-search-data.model';
import { TypeOperationAlfaMain } from 'src/app/apps/interfaces/general/content-info';
import {
  LayoutCardCadastralInformationPropertyComponentComponent
} from '../../information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import { ContentInfoSchema } from 'src/app/apps/interfaces/general/content-info-schema';
import { BaunitHead } from 'src/app/apps/interfaces/information-property/baunit-head.model';
import { TABLE_COLUMNS } from '../../../constants/information-property/information-property-owners.constants';

@Component({
  selector: 'vex-modification-property-units',
  standalone: true,
  imports: [
    // Vex
    // Material
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule
    // Custom
  ],
  templateUrl: './modification-property-units.component.html',
  styles: ``
})
export class ModificationPropertyUnitsComponent implements OnInit {
  properties$!: MatTableDataSource<InformationPegeable>;
  filteredProperties$!: Observable<InformationPegeable>;
  searchForm: FormGroup = this.fb.group({
    searchTerm: [''],
    selectedMatriz: ['']
  });
  columns: TableColumn<Operation>[] = TABLE_COLUMNS;

  get ADD(): TypeOperationAlfaMain {
    return TYPEOPERATION_ADD;
  }

  get CRE(): TypeOperationAlfaMain {
    return TYPEOPERATION_CREATE;
  }

  get DEL(): TypeOperationAlfaMain {
    return TYPEOPERATION_DELETE;
  }

  actions = [
    {
      label: 'Editar',
      icon: 'mat:edit',
      action: (row: Operation) => this.editPropertyUnit(row)
    },
    {
      label: 'Borrar',
      icon: 'mat:delete',
      action: (row: Operation) => this.deletePropertyUnit(row)
    }
  ];

  // Configuration paginator
  totalElements = 0;
  PAGE = PAGE;
  PAGE_SIZE = PAGE_SIZE;
  PAGE_OPTIONS = PAGE_OPTION__5_7_10;

  @ViewChild(MatPaginator, { read: true }) paginator!: MatPaginator;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: { executionId: string; baunitIdE: string; npnMatrix: string },
    private fb: FormBuilder,
    private alfaMainService: AlfaMainService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.properties$ = new MatTableDataSource();
    this.getPropertiesUnits();

    this.properties$.paginator = this.paginator;
  }

  getPropertiesUnits(): void {
    const page = new PageSearchData(
      this.PAGE,
      this.PAGE_SIZE,
      this.data.executionId
    );

    this.alfaMainService
      .getListAlfaMainOperationsUnitsByBaunitId(
        page,
        this.data.executionId,
        this.data.baunitIdE
      )
      .subscribe({
        next: (result: InformationPegeable) => {
          this.properties$.data = result.content;
          this.totalElements = result.totalElements!;
        }
      });
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  statusMessage(value: string): string {
    switch (value) {
      case 'CREATE':
        return 'Agregado';
      case 'UPDATE':
        return 'Modificado';
      case 'DELETE':
        return 'Eliminado';
      default:
        return '';
    }
  }

  statusClass(value: string): string {
    switch (value) {
      case 'CREATE':
        return 'px-4 py-2 rounded-xl !text-white inline-flex self-end max-h-[40px] min-w-[90px] !bg-green-600';
      case 'UPDATE':
        return 'px-4 py-2 rounded-xl !text-white inline-flex self-end max-h-[40px] min-w-[90px] !bg-primary-600';
      case 'DELETE':
        return 'px-4 py-2 rounded-xl !text-white inline-flex self-end max-h-[40px] min-w-[90px] !bg-red-600';
      default:
        return '';
    }
  }

  editPropertyUnit(row: BaunitHead) {
    console.log('Editando');
    console.log(row);
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: new ContentInfoSchema(
          row.baunitIdE,
          row,
          this.data.executionId,
          LIST_SCHEMAS_CONTROL_CHANGES,
          TYPEINFORMATION_EDITION
        )
      })
      .afterClosed();
  }

  deletePropertyUnit(row: Operation) {
    console.log('Borrando');
    console.log(row);
  }

  openCrudAlfaMain(type: TypeOperationAlfaMain) {
    const addNpnLike: string = this.data?.npnMatrix?.slice(0, -8) || '';
    let config = {};
    if (type === TYPEOPERATION_ADD) {
      config = {
        width: '30%',
        minHeight: '30%',
        disableClose: true,
        data: new DataAlfaMain(
          this.data.executionId,
          type,
          addNpnLike ? { addNpnLike } : null
        )
      };
    } else {
      config = {
        width: '70%',
        height: '90%',
        disableClose: true,
        data: new DataAlfaMain(
          this.data.executionId,
          type,
          addNpnLike ? { addNpnLike } : null
        )
      };
    }
    this.dialog.open(CrudAlfaMainComponent, config);
  }

  onPageChange(event: PageEvent) {
    const page = new PageSearchData(
      event.pageIndex,
      event.pageSize,
      this.data.executionId
    );
    this.alfaMainService.getListAlfaMainOperationsUnitsByBaunitId(
      page,
      this.data.executionId,
      this.data.baunitIdE
    )
    .subscribe({
      next: (result: InformationPegeable) => {
        this.properties$.data = result.content;
        this.totalElements = result.totalElements!;
      }
    });
  }
}
