import { AfterViewInit, Component, Inject, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { AlfaMainService } from 'src/app/apps/services/bpm/core/alfa-main.service';
import { CrudAlfaMainComponent } from '../alfa-main/crud-alfa-main/crud-alfa-main.component';
import { DataAlfaMain, ModificationUnitProperties } from 'src/app/apps/interfaces/bpm/data-alfa-main.model';
import { InformationPegeable } from 'src/app/apps/interfaces/general/information-pegeable.model';
import { Operation } from 'src/app/apps/interfaces/bpm/operation';
import {
  LIST_SCHEMAS_CONTROL_MAIN,
  LIST_SCHEMAS_CONTROL_TEMP,
  MODAL_LARGE,
  PAGE,
  PAGE_OPTION_5_7_10,
  PAGE_SIZE,
  TYPE_BUTTON_FIVE,
  TYPE_BUTTON_FOUR,
  TYPE_BUTTON_NINE,
  TYPE_BUTTON_ONE,
  TYPE_BUTTON_SIX,
  TYPE_BUTTON_TREE,
  TYPE_BUTTON_TWO,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL,
  TYPE_OPERATION_ADD,
  TYPE_OPERATION_CALCULATE_BOUNDARIES,
  TYPE_OPERATION_CREATE,
  TYPE_OPERATION_CREATE_GEO,
  TYPE_OPERATION_DELETE,
  TYPE_OPERATION_DELETE_GEO
} from 'src/app/apps/constants/general/constants';
import { PageSearchData } from 'src/app/apps/interfaces/general/page-search-data.model';
import { TypeOperationAlfaMain } from 'src/app/apps/interfaces/general/content-info';
import {
  LayoutCardCadastralInformationPropertyComponentComponent
} from '../../information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import { ContentInfoSchema } from 'src/app/apps/interfaces/general/content-info-schema';
import { BaunitHead } from 'src/app/apps/interfaces/information-property/baunit-head.model';
import { MODIFYCATION_UNITS_TABLE_COLUMNS } from 'src/app/apps/constants/modification-property-units.constants';
import { FluidHeightDirective } from '../../../directives/fluid-height.directive';
import { FluidMinHeightDirective } from '../../../directives/fluid-min-height.directive';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';

@Component({
  selector: 'vex-modification-property-units',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatTableModule,
    MatMenuModule,
    MatPaginatorModule,
    FluidHeightDirective,
    FluidMinHeightDirective,
    VexPageLayoutContentDirective,
    MatSortHeader,
    MatFormField,
    MatInput,
    MatPrefix,
    ReactiveFormsModule,
    MatSort
    // Custom
  ],
  templateUrl: './modification-property-units.component.html',
  styleUrl: './modification-property-units.component.scss'
})
export class ModificationPropertyUnitsComponent implements OnInit, AfterViewInit {

  executionId: string | null = null;
  baUnitId: string | null = null;
  operationBaUnitHead: Operation | null = null;
  // Configuration paginator
  totalElements = 0;
  page = PAGE;
  pageSize = PAGE_SIZE;
  pageSizeOptions = PAGE_OPTION_5_7_10;

  dataSource!: MatTableDataSource<BaunitHead>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  contentInformation!: InformationPegeable;

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;

  searchForm: FormGroup = this.fb.group({
    searchTerm: [''],
    selectedMatriz: ['']
  });

  columns: TableColumn<Operation>[] = MODIFYCATION_UNITS_TABLE_COLUMNS;

  @ViewChild(MatPaginator, { read: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataInformationUnitProperties: ModificationUnitProperties,
    private dialog: MatDialog,
    private fb: FormBuilder,
    private readonly layoutService: VexLayoutService,
    private alfaMainService: AlfaMainService
  ) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    if (this.dataInformationUnitProperties?.executionId) {
      this.executionId = this.dataInformationUnitProperties?.executionId;
    }
    if (this.dataInformationUnitProperties?.executionId) {
      this.executionId = this.dataInformationUnitProperties?.executionId;
    }
    if (this.dataInformationUnitProperties?.baunitIdE) {
      this.baUnitId = this.dataInformationUnitProperties?.baunitIdE;
    }
    if (this.dataInformationUnitProperties?.operationBaUnitHead) {
      this.operationBaUnitHead = this.dataInformationUnitProperties?.operationBaUnitHead;
    }
    this.getPropertiesUnits();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  getPropertiesUnits(): void {
    if (!this.baUnitId) {
      return;
    }
    const page = new PageSearchData(this.page, this.pageSize, this.executionId);
    this.alfaMainService.getListAlfaMainOperationsUnitsByBaUnitId(
      page, this.executionId, this.baUnitId).subscribe({
      error: () => this.captureInformationSubscribeError(),
      next: (result: InformationPegeable) => this.captureInformationSubscribe(result)
    });
  }

  captureInformationSubscribeError(): void {
    this.contentInformation = new InformationPegeable();
    this.dataSource.data = [];
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformation = result;
    this.captureInformationData();
  }

  captureInformationData(): void {
    let data: BaunitHead[];
    if (this.contentInformation?.content != null) {
      data = this.contentInformation.content;
      this.dataSource.data = data;
    }

    if (this.contentInformation == null || (this.contentInformation.content == null || this.contentInformation.content.length <= 0)) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformation.totalElements) {
      this.totalElements = this.contentInformation.totalElements;
    }

    if (this.contentInformation.pageable == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformation.pageable.pageNumber != null) {
      this.page = this.contentInformation.pageable.pageNumber;
    }
  }

  editPropertyUnit(row: BaunitHead) {
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: new ContentInfoSchema(
          row.baunitIdE,
          row,
          this.executionId,
          LIST_SCHEMAS_CONTROL_TEMP,
          TYPE_INFORMATION_EDITION,
          '',
          this.dataInformationUnitProperties.resources
        )
      })
      .afterClosed();
  }

  deletePropertyUnit(row: Operation) {
  }

  openCrudAlfaMain(type: TypeOperationAlfaMain) {
    if (!this.executionId) {
      return;
    }
    const addNpnLike: string = this.dataInformationUnitProperties?.npnMatrix?.slice(0, -8) || '';
    let config = {};
    let data: DataAlfaMain = new DataAlfaMain(this.executionId, type, addNpnLike ? { addNpnLike } : null);
    data.operationBaUnitHead = this.operationBaUnitHead;
    if (type === TYPE_OPERATION_ADD) {
      config = {
        width: '30%',
        minHeight: '30%',
        disableClose: true,
        data: data
      };
    } else {
      config = {
        width: '70%',
        height: '90%',
        disableClose: true,
        data: data
      };
    }
    this.dialog.open(CrudAlfaMainComponent, config);
  }

  refreshPaginator(event: PageEvent) {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPropertiesUnits();
  }

  openCadastralInformationProperty(data: BaunitHead): void {
    let schemas: string[] = [];
    schemas = this.executionId ? LIST_SCHEMAS_CONTROL_TEMP : LIST_SCHEMAS_CONTROL_MAIN;
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: new ContentInfoSchema(
          data.baunitIdE, data,
          this.executionId,
          schemas,
          TYPE_INFORMATION_VISUAL
        )
      })
      .afterClosed();
  }

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }

  get visibleColumns() {
    return this.columns.filter((column) => column.visible).map((column) => column.property);
  }

  protected readonly TYPE_OPERATION_CREATE = TYPE_OPERATION_CREATE;
  protected readonly TYPE_OPERATION_DELETE = TYPE_OPERATION_DELETE;
  protected readonly TYPE_OPERATION_ADD = TYPE_OPERATION_ADD;
}
