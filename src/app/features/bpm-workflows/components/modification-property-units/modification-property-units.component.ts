import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Inject,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { distinctUntilChanged, Observable } from 'rxjs';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule
} from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  DataAlfaMain,
  ModificationUnitProperties
} from '@shared/interfaces';
import { InformationPegeable } from 'src/app/apps/interfaces/general/information-pegeable.model';
import { Operation } from '@shared/interfaces';
import {
  LIST_SCHEMAS_CONTROL_MAIN,
  LIST_SCHEMAS_CONTROL_TEMP,
  MODAL_LARGE,
  MODAL_MIN_MEDIUM_ALL,
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE,
  TYPE_CREATE,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL,
  TYPE_OPERATION_ADD,
  TYPE_OPERATION_DELETE,
  TYPE_UPDATE
} from '@shared/constants';
import { PageSearchData } from 'src/app/apps/interfaces/general/page-search-data.model';
import { TypeOperationAlfaMain } from 'src/app/apps/interfaces/general/content-info';
import { LayoutCardCadastralInformationPropertyComponentComponent } from 'src/app/apps/components/information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import { ContentInfoSchema } from 'src/app/apps/interfaces/general/content-info-schema';
import { MODIFYCATION_UNITS_TABLE_COLUMNS } from '@shared/constants';
import { FluidHeightDirective } from '@shared/directives';
import { FluidMinHeightDirective } from '@shared/directives';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatSort, MatSortHeader } from '@angular/material/sort';
import { MatFormField, MatPrefix } from '@angular/material/form-field';
import { MatInput } from '@angular/material/input';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { UnitPropertyInformationService } from '@shared/services';
import { BaUnitHeadPercentage } from '@shared/interfaces';
import { NgClass, PercentPipe } from '@angular/common';
import { CrudPropertyUnitsComponent } from '@features/bpm-workflows/components/modification-property-units/crud-property-units/crud-property-units.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { BpmCoreService } from '@shared/services';
import Swal from 'sweetalert2';
import { AlfaMainService } from '@shared/services';
import { DifferenceChanges } from '@shared/interfaces';
import {
  CONSTANT_TEXT_ALFA_MAIN_VIEW_CHANGE_ERROR_NO_CHANGE,
  CONSTANT_TEXT_ALFA_MAIN_VIEW_CHANGE_ERROR_THROWERROR,
  CONSTANT_TEXT_ALFA_MAIN_VIEW_NO_CHANGE
} from '@shared/constants';
import { ViewChangesBpmOperationComponent } from '@features/bpm-workflows/components/view-changes-bpm-operation/view-changes-bpm-operation.component';
import { LoaderComponent } from '@shared/ui/loader/loader.component';
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
    MatSort,
    PercentPipe,
    NgClass,
    // Custom
    LoaderComponent
  ],
  templateUrl: './modification-property-units.component.html',
  styleUrl: './modification-property-units.component.scss'
})
export class ModificationPropertyUnitsComponent
  implements OnInit, AfterViewInit
{
  executionId!: string;
  baUnitId: string | null = null;
  operationBaUnitHead: Operation | null = null;
  // Configuration paginator
  totalElements = 0;
  page = PAGE;
  pageSize = PAGE_SIZE;
  pageSizeOptions = PAGE_SIZE_OPTION;
  dataSource!: MatTableDataSource<BaUnitHeadPercentage>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  contentInformation!: InformationPegeable;
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  columns: TableColumn<BaUnitHeadPercentage>[] =
    MODIFYCATION_UNITS_TABLE_COLUMNS;

  // Signals
  isZonesAssigning = signal(false);

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  @ViewChild(MatPaginator, { read: true }) paginator!: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  constructor(
    @Inject(MAT_DIALOG_DATA)
    public dataInformationUnitProperties: ModificationUnitProperties,
    private unitPropertyInformationService: UnitPropertyInformationService,
    private bpmCoreService: BpmCoreService,
    private alfaMainService: AlfaMainService,
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService
  ) {}

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
      this.operationBaUnitHead =
        this.dataInformationUnitProperties?.operationBaUnitHead;
    }
    this.getPropertiesUnits();

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
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
    this.unitPropertyInformationService
      .getListPropertyUnitsByBaUnitIdV2(page, this.executionId, this.baUnitId)
      .pipe(distinctUntilChanged())
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: InformationPegeable) => {
          this.captureInformationSubscribe(result);
        }
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
    let data: BaUnitHeadPercentage[];
    if (this.contentInformation?.content != null) {
      data = this.contentInformation.content;
      data = data.map(
        (row: BaUnitHeadPercentage) => new BaUnitHeadPercentage(row)
      );
      this.dataSource.data = data;
    }

    if (
      this.contentInformation == null ||
      this.contentInformation.content == null ||
      this.contentInformation.content.length <= 0
    ) {
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

  viewChanges(row: BaUnitHeadPercentage): void {
    if (!row || !row.baunitHead?.baunitIdE || !this.executionId) {
      this.getAlertError(CONSTANT_TEXT_ALFA_MAIN_VIEW_NO_CHANGE);
      return;
    }
    this.bpmCoreService
      .viewChangesBpmOperationTemp(this.executionId, row.baunitHead?.baunitIdE)
      .subscribe({
        error: (error) => {
          this.getAlertError(
            CONSTANT_TEXT_ALFA_MAIN_VIEW_CHANGE_ERROR_THROWERROR +
              error.toString()
          );
        },
        next: (result: DifferenceChanges[]) => {
          this.openDifferenceChangesProperty(result, row.baunitHead?.baunitIdE);
        }
      });
  }

  editPropertyUnit(row: BaUnitHeadPercentage) {
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: new ContentInfoSchema(
          row.baunitHead?.baunitIdE,
          row.baunitHead,
          this.executionId,
          LIST_SCHEMAS_CONTROL_TEMP,
          TYPE_INFORMATION_EDITION,
          '',
          this.dataInformationUnitProperties.resources
        )
      })
      .afterClosed().subscribe(() => this.getPropertiesUnits());
  }

  openCrudAlfaMain(type: TypeOperationAlfaMain) {
    if (!this.executionId || type !== TYPE_OPERATION_ADD) {
      return;
    }
    let config = {};
    const addNpnLike: string =
      this.dataInformationUnitProperties?.npnMatrix?.slice(0, -8) || '';
    const data: DataAlfaMain = new DataAlfaMain(
      this.executionId,
      type,
      addNpnLike ? { addNpnLike } : null
    );
    data.operationBaUnitHead = this.operationBaUnitHead;

    config = {
      width: '30%',
      minHeight: '30%',
      disableClose: true,
      data: data
    };
    this.dialog
      .open(CrudPropertyUnitsComponent, config)
      .afterClosed()
      .subscribe((result: boolean) => {
        if (result) {
          this.getPropertiesUnits();
        }
      });
  }

  openDifferenceChangesProperty(
    result: DifferenceChanges[],
    baunitIdE: string | undefined
  ): void {
    if (!result || result.length <= 0 || !this.executionId) {
      this.getAlertError(CONSTANT_TEXT_ALFA_MAIN_VIEW_CHANGE_ERROR_NO_CHANGE);
      return;
    }
    const data: DifferenceChanges[] = result.map(
      (row: DifferenceChanges) =>
        new DifferenceChanges(row, this.executionId, baunitIdE)
    );
    this.dialog
      .open(ViewChangesBpmOperationComponent, {
        ...MODAL_MIN_MEDIUM_ALL,
        disableClose: true,
        data: data
      })
      .afterClosed();
  }

  refreshPaginator(event: PageEvent) {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.getPropertiesUnits();
  }

  openCadastralInformationProperty(data: BaUnitHeadPercentage): void {
    let schemas: string[] = [];
    schemas = this.executionId
      ? LIST_SCHEMAS_CONTROL_TEMP
      : LIST_SCHEMAS_CONTROL_MAIN;
    const dataInfo: ContentInfoSchema = new ContentInfoSchema(
      data.baunitHead?.baunitIdE,
      data.baunitHead,
      this.executionId,
      schemas,
      TYPE_INFORMATION_VISUAL
    );
    dataInfo.levelInfo = 2;
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: dataInfo
      })
      .afterClosed();
  }

  deletePropertyUnit(row: BaUnitHeadPercentage) {
    if (row.operationType === TYPE_CREATE) {
      Swal.fire({
        text: '¿Está seguro de remover esta unidad predial?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, remover',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed && this.executionId) {
          this.bpmCoreService
            .clearPropertyBpmOperation(
              this.executionId,
              row.baunitHead!.baunitIdE as string
            )
            .subscribe({
              next: () => this.getPropertiesUnits(),
              error: () =>
                this.getAlertError('Error al eliminar la unidad predial.')
            });
        }
      });
      return;
    }

    if (row.operationType === TYPE_UPDATE) {
      Swal.fire({
        text: '¿Está seguro que desea cambiar el estado a eliminacion a esta unidad predial?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed && this.executionId) {
          this.executeResultChangeTemporaryStateBeaUnitHead(row);
        }
      });
      return;
    }

    Swal.fire({
      text: '¿Está seguro que desea reincorporar esta unidad predial?',
      icon: 'info',
      showCancelButton: true,
      confirmButtonText: 'Sí, reincorporar',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed && this.executionId) {
        this.executeResultChangeTemporaryStateBeaUnitHead(row);
      }
    });
  }

  executeResultChangeTemporaryStateBeaUnitHead(row: BaUnitHeadPercentage) {
    if (!this.executionId) {
      return;
    }
    this.alfaMainService
      .changeTemporaryStateBeaUnitHeadByExistTemp(
        row.baunitHead!.baunitIdE as string,
        this.executionId
      )
      .subscribe({
        next: () => this.getPropertiesUnits(),
        error: () => this.getAlertError('Error al eliminar la unidad predial.')
      });
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  addRemoveIcon(operationType: string): string {
    return operationType === TYPE_OPERATION_DELETE
      ? 'mat:recycling'
      : 'mat:delete';
  }

  addRemoveText(operationType: string): string {
    return operationType === TYPE_OPERATION_DELETE ? 'Reincorporar' : 'Borrar';
  }

  getAlertError(text: string) {
    Swal.fire({
      text: text,
      icon: 'error',
      showConfirmButton: false,
      timer: 4000
    }).then();
  }

  onAssignZones() {
    if (!this.executionId || !this.baUnitId) return;
    this.isZonesAssigning.set(true);

    this.unitPropertyInformationService
      .assignamentZones(this.executionId, this.baUnitId)
      .subscribe({
        next: (response) => {
          this.isZonesAssigning.set(false);
          Swal.fire({
            title: 'Asignación de zonas exitosa',
            text: response.message,
            icon: 'success',
            showConfirmButton: true,
            confirmButtonText: 'Aceptar',
            showCancelButton: false,
            allowOutsideClick: false
          });
        },
        error: () => {
          this.isZonesAssigning.set(false);
        }
      });
  }

  protected readonly TYPE_OPERATION_DELETE = TYPE_OPERATION_DELETE;
  protected readonly TYPE_OPERATION_ADD = TYPE_OPERATION_ADD;
}
