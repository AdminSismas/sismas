// Angular Framework
import { AfterViewInit, Component, Inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
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
import { CrudAlfaMainComponent } from '../alfa-main/crud-alfa-main/crud-alfa-main.component';
import { DataAlfaMain, ModificationUnitProperties } from 'src/app/apps/interfaces/bpm/data-alfa-main.model';
import { InformationPegeable } from 'src/app/apps/interfaces/general/information-pegeable.model';
import { Operation } from 'src/app/apps/interfaces/bpm/operation';
import {
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
  TYPE_INFORMATION_EDITION, TYPE_INFORMATION_VISUAL,
  TYPE_OPERATION_ADD,
  TYPE_OPERATION_CALCULATE_BOUNDARIES,
  TYPE_OPERATION_CREATE,
  TYPE_OPERATION_CREATE_GEO,
  TYPE_OPERATION_DELETE,
  TYPE_OPERATION_DELETE_GEO
} from 'src/app/apps/constants/general/constants';
import { PageSearchData } from 'src/app/apps/interfaces/general/page-search-data.model';
import { TypeInformation, TypeOperationAlfaMain } from 'src/app/apps/interfaces/general/content-info';
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
import { environment } from '../../../../../environments/environments';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { VexLayoutService } from '@vex/services/vex-layout.service';

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
    MatPaginatorModule,
    FluidHeightDirective,
    FluidMinHeightDirective,
    VexPageLayoutContentDirective,
    MatSortHeader,
    MatFormField,
    MatInput,
    MatPrefix,
    ReactiveFormsModule
    // Custom
  ],
  templateUrl: './modification-property-units.component.html',
  styleUrl: './modification-property-units.component.scss'
})
export class ModificationPropertyUnitsComponent implements OnInit, AfterViewInit {


  executionId: string | null = null;
  baUnitId: string | null = null;
  // Configuration paginator
  totalElements = 0;
  PAGE = PAGE;
  PAGE_SIZE = PAGE_SIZE;
  PAGE_OPTIONS = PAGE_OPTION_5_7_10;

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
    const page = new PageSearchData(this.PAGE, this.PAGE_SIZE, this.executionId);
    this.alfaMainService.getListAlfaMainOperationsUnitsByBaUnitId(
      page, this.executionId, this.baUnitId).subscribe({
      next: (result) => this.captureInformationSubscribe(result),
      next: (result: InformationPegeable) => this.captureInformationSubscribe(result)
    });
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformations = result;
    this.captureInformationCadastralData();
  }

  editPropertyUnit(row: BaunitHead) {
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: new ContentInfoSchema(
          row.baunitIdE,
          row,
          this.data.executionId,
          LIST_SCHEMAS_CONTROL_TEMP,
          TYPE_INFORMATION_EDITION,
          '',
          this.data.resources
        )
      })
      .afterClosed();
  }

  deletePropertyUnit(row: Operation) {
  }

  openCrudAlfaMain(type: TypeOperationAlfaMain) {
    const addNpnLike: string = this.data?.npnMatrix?.slice(0, -8) || '';
    let config = {};
    if (type === TYPE_OPERATION_ADD) {
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
    this.alfaMainService.getListAlfaMainOperationsUnitsByBaUnitId(
      page,
      this.data.executionId,
      this.data.baunitIdE
    )
      .subscribe({
        next: (result: InformationPegeable) => {
          this.dataSource.data = result.content;
          this.totalElements = result.totalElements!;
        }
      });
  }

  openCadastralInformationProperty(data: BaunitHead): void {
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: new ContentInfoSchema(
          data.baunitIdE, data,
          this.executionId,
          this.viewSchemas(),
          TYPE_INFORMATION_VISUAL
        )
      })
      .afterClosed();
  }

  get visibleColumns() {
    return this.columns.filter((column) => column.visible).map((column) => column.property);
  }

  protected readonly TYPE_OPERATION_CREATE = TYPE_OPERATION_CREATE;
  protected readonly TYPE_OPERATION_DELETE = TYPE_OPERATION_DELETE;
  protected readonly TYPE_OPERATION_ADD = TYPE_OPERATION_ADD;
  protected readonly TYPE_OPERATION_CALCULATE_BOUNDARIES = TYPE_OPERATION_CALCULATE_BOUNDARIES;
  protected readonly TYPE_BUTTON_ONE = TYPE_BUTTON_ONE;
  protected readonly TYPE_BUTTON_FIVE = TYPE_BUTTON_FIVE;
  protected readonly TYPE_BUTTON_SIX = TYPE_BUTTON_SIX;
  protected readonly TYPE_OPERATION_CREATE_GEO = TYPE_OPERATION_CREATE_GEO;
  protected readonly TYPE_BUTTON_FOUR = TYPE_BUTTON_FOUR;
  protected readonly TYPE_OPERATION_DELETE_GEO = TYPE_OPERATION_DELETE_GEO;
  protected readonly TYPE_BUTTON_TWO = TYPE_BUTTON_TWO;
  protected readonly TYPE_BUTTON_VALIDITY = TYPE_BUTTON_NINE;
  protected readonly TYPE_BUTTON_TREE = TYPE_BUTTON_TREE;
}
