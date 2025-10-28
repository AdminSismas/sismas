import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnChanges,
  OnInit,
  Output,
  SimpleChanges,
  input,
  viewChild
} from '@angular/core';
import {
  LIST_SCHEMAS_CONTROL_CHANGES,
  LIST_SCHEMAS_CONTROL_TEMP,
  MODAL_LARGE,
  MODAL_MEDIUM_H90,
  MODAL_MIN_MEDIUM_ALL,
  MODAL_SMALL_XS,
  PAGE,
  TABLE_ALFA_MAIN_OPERATION_COLUMN,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL
} from '@shared/constants';

import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { Observable, ReplaySubject } from 'rxjs';
import { InformationPegeable } from '@shared/interfaces';
import { SearchData } from '@shared/interfaces';
import { TableColumn } from '@vex/interfaces/table-column.interface';

import { VexLayoutService } from '@vex/services/vex-layout.service';

import { Operation } from '@shared/interfaces';
import { LayoutCardCadastralInformationPropertyComponentComponent } from 'src/app/apps/components/information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import { ContentInfoSchema } from '@shared/models';
import { filter } from 'rxjs/operators';
import { BpmCoreService } from '@shared/services';
import { DifferenceChanges } from '@shared/interfaces';
import { ViewChangesBpmOperationComponent } from '@features/bpm-workflows/components/view-changes-bpm-operation/view-changes-bpm-operation.component';

import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyLandsPipe } from 'src/app/apps/pipes/currency-lands.pipe';
import { ModificationPropertyUnitsComponent } from '@features/bpm-workflows/components/modification-property-units/modification-property-units.component';
import Swal from 'sweetalert2';
import { AlfaMainService } from '@features/bpm-workflows/services/alfa-main.service';import {
  CONSTANT_TEXT_ALFA_MAIN_VIEW_CHANGE_ERROR_NO_CHANGE,
  CONSTANT_TEXT_ALFA_MAIN_VIEW_NO_CHANGE
} from '@shared/constants';
import { CreateMatrixFromNphComponent } from './create-matrix-from-nph/create-matrix-from-nph.component';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { NgClass } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginatorModule, MatPaginator } from '@angular/material/paginator';
import { MatSortModule, MatSort } from '@angular/material/sort';
import { MatTableModule, MatTableDataSource } from '@angular/material/table';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatMenuModule } from '@angular/material/menu';

@Component({
  selector: 'table-alfa-main',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    CurrencyLandsPipe,
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgClass,
    MatMenuModule,
    MatDialogModule,
    MatDividerModule
  ],
  templateUrl: './table-alfa-main.component.html',
  styleUrl: './table-alfa-main.component.scss'
})
export class TableAlfaMainComponent
  implements OnInit, AfterViewInit, OnChanges
{
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private dialog = inject(MatDialog);

  @Input({ required: true }) contentInformations!: InformationPegeable;
  readonly executionId = input.required<string>();
  readonly mode = input.required<number>();
  readonly resources = input<string[]>([]);
  readonly columns = input<TableColumn<Operation>[]>(
    TABLE_ALFA_MAIN_OPERATION_COLUMN
  );
  readonly notActions = input(false, {
    transform: (value): boolean => {
      if (value === null || value === undefined) return false;
      if (value === '') return true;
      if (typeof value === 'boolean') return value;
      return false;
    }
  });

  @Output() refreshData = new EventEmitter<void>();

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  searchData!: SearchData;

  page = PAGE;
  totalElements = 0;
  pageSize = 100;
  dataSource!: MatTableDataSource<Operation>;
  npnRemoving?: string;

  _contentInformations$: ReplaySubject<InformationPegeable> =
    new ReplaySubject<InformationPegeable>(0);
  contentInformations$: Observable<InformationPegeable> =
    this._contentInformations$.asObservable();

  readonly paginator = viewChild(MatPaginator);
  readonly sort = viewChild(MatSort);

  constructor(
    private readonly layoutService: VexLayoutService,
    private bpmCoreService: BpmCoreService,
    private alfaMainService: AlfaMainService
  ) {}

  get visibleColumns() {
    const columns = this.notActions()
      ? this.columns().filter((col) => col.property !== 'actions')
      : this.columns();

    return columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.contentInformations$
      .pipe(filter<InformationPegeable>(Boolean))
      .subscribe((result: InformationPegeable) => {
        this.captureInformationSubscribe(result);
      });
  }

  ngAfterViewInit(): void {
    const paginator = this.paginator();
    if (paginator) {
      this.dataSource.paginator = paginator;
    }

    const sort = this.sort();
    if (sort) {
      this.dataSource.sort = sort;
    }
  }

  ngOnChanges(changes: SimpleChanges) {
    if (changes['contentInformations'] && this.contentInformations) {
      this._contentInformations$.next(this.contentInformations);
    }
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformations = result;
    this.captureInformationCadastralData();
  }

  captureInformationCadastralData(): void {
    let data: Operation[];
    if (this.contentInformations?.content !== null) {
      data = this.contentInformations.content;
      this.dataSource.data = data;
    }

    if (this.contentInformations == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformations.totalElements) {
      this.totalElements = this.contentInformations.totalElements;
    }

    if (this.contentInformations.pageable == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformations.pageable.pageNumber != null) {
      this.page = this.contentInformations.pageable.pageNumber;
    }
  }

  openCadastralInformationProperty(operation: Operation): void {
    if (!operation || !operation?.baunitHead?.baunitIdE) {
      Swal.fire({
        text: 'No se puede ver la información de la unidad predial, consulte al administrador.',
        icon: 'error',
        showConfirmButton: false,
        timer: 10000
      }).then();
      return;
    }
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: new ContentInfoSchema(
          operation?.baunitHead?.baunitIdE,
          operation?.baunitHead,
          this.executionId(),
          LIST_SCHEMAS_CONTROL_CHANGES,
          TYPE_INFORMATION_VISUAL
        )
      })
      .afterClosed();
  }

  viewChanges(operation: Operation): void {
    if (!operation || !operation?.baunitHead?.baunitIdE) {
      this.msgErrorConsultingAdministration(
        CONSTANT_TEXT_ALFA_MAIN_VIEW_NO_CHANGE
      );
      return;
    }
    this.bpmCoreService
      .viewChangesBpmOperationTemp(
        this.executionId(),
        operation?.baunitHead?.baunitIdE
      )
      .subscribe({
        error: () => this.messageChangesNoAvailable(),
        next: (result: DifferenceChanges[]) => {
          this.openDifferenceChangesProperty(
            result,
            this.executionId(),
            operation?.baunitHead?.baunitIdE
          );
        }
      });
  }

  editInformation(operation: Operation): void {
    if (!operation || !operation?.baunitHead?.baunitIdE) {
      this.msgErrorConsultingAdministration(
        'No se puede ver la información de la unidad predial, consulte al administrador.'
      );
      return;
    }
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: new ContentInfoSchema(
          operation?.baunitHead?.baunitIdE,
          operation?.baunitHead,
          this.executionId(),
          LIST_SCHEMAS_CONTROL_TEMP,
          TYPE_INFORMATION_EDITION,
          '',
          this.resources()
        )
      })
      .afterClosed();
  }

  removeInformation(operation: Operation): void {
    this.npnRemoving = operation.npnlike;
    Swal.fire({
      title: 'Confirmar eliminación',
      text: '¿Está seguro de remover esta unidad predial?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonText: 'Sí, remover',
      cancelButtonText: 'Cancelar',
      confirmButtonColor: '#3085d6',
      cancelButtonColor: '#d33'
    }).then((result) => {
      if (result.isConfirmed) {
        this.bpmCoreService
          .clearPropertyBpmOperation(
            this.executionId(),
            operation.baunitHead!.baunitIdE as string
          )
          .subscribe({
            next: () => {
              this.refreshData.emit();
            },
            error: (error: HttpErrorResponse) => {
              this.msgErrorConsultingAdministration(
                'Error al eliminar la unidad predial.'
              );
              throw error;
            }
          });
      }
    });
  }

  changeTemporaryStateBeaUnitHead(operation: Operation): void {
    this.npnRemoving = operation.npnlike;
    if (operation.operationType === 'UPDATE') {
      Swal.fire({
        title: 'Confirmar eliminación',
        text: '¿Está seguro que desea cambiar el estado a eliminacion a esta unidad predial?',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          this.executeResultChangeTemporaryStateBeaUnitHead(operation);
        }
      });
    } else if (operation.operationType === 'DELETE') {
      Swal.fire({
        title: 'Confirmar reincorporacion',
        text: '¿Está seguro que desea reincorporar esta unidad predial?',
        icon: 'info',
        showCancelButton: true,
        confirmButtonText: 'Sí, reincorporar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#3085d6',
        cancelButtonColor: '#d33'
      }).then((result) => {
        if (result.isConfirmed) {
          this.executeResultChangeTemporaryStateBeaUnitHead(operation);
        }
      });
    }
  }

  executeResultChangeTemporaryStateBeaUnitHead(operation: Operation) {
    this.alfaMainService
      .changeTemporaryStateBeaUnitHeadByExistTemp(
        operation.baunitHead!.baunitIdE as string,
        this.executionId()
      )
      .subscribe({
        next: () => {
          this.refreshData.emit();
        },
        error: (error: HttpErrorResponse) => {
          this.msgErrorConsultingAdministration(
            'Error al eliminar la unidad predial.'
          );
          throw error;
        }
      });
  }

  openDifferenceChangesProperty(
    result: DifferenceChanges[],
    executionId: string,
    baunitIdE: string | undefined
  ): void {
    if (!result || result.length <= 0) {
      this.messageChangesNoAvailable();
      return;
    }

    const data: DifferenceChanges[] = result.map(
      (row: DifferenceChanges) =>
        new DifferenceChanges(row, executionId, baunitIdE)
    );
    this.dialog
      .open(ViewChangesBpmOperationComponent, {
        ...MODAL_MIN_MEDIUM_ALL,
        disableClose: true,
        data: data
      })
      .afterClosed();
  }

  messageChangesNoAvailable() {
    this.msgErrorConsultingAdministration(
      CONSTANT_TEXT_ALFA_MAIN_VIEW_CHANGE_ERROR_NO_CHANGE
    );
  }

  editCadastralUnits(row: Operation) {
    this.dialog.open(ModificationPropertyUnitsComponent, {
      ...MODAL_MEDIUM_H90,
      disableClose: true,
      data: {
        executionId: this.executionId(),
        baunitIdE: row.baunitHead?.baunitIdE,
        npnMatrix: row.baunitHead!.cadastralNumber,
        resources: this.resources(),
        operationBaUnitHead: row
      }
    });
  }

  msgErrorConsultingAdministration(msg: string) {
    Swal.fire({
      text: msg,
      icon: 'error',
      showConfirmButton: false,
      timer: 10000
    }).then();
  }

  addRemoveIcon(operationType: string): string {
    if (operationType === 'UPDATE') {
      return 'mat:delete';
    }
    return 'mat:recycling';
  }

  addRemoveText(operationType: string): string {
    if (operationType === 'UPDATE') {
      return 'Borrar';
    }
    return 'Reincorporar';
  }

  isMatriz(condition: string): boolean {
    return (
      condition === '(Condominio) Matriz' ||
      condition === '(Propiedad horizontal) Matriz' ||
      condition === '(Parque cementerio) Matriz'
    );
  }

  changeNphToMatriz(row: Operation) {
    this.dialog
      .open(CreateMatrixFromNphComponent, {
        ...MODAL_SMALL_XS
      })
      .afterClosed()
      .subscribe((result) => {
        if (result.response) {
          this.bpmCoreService
            .createMasterFromNph(
              row.baunitIdE,
              this.executionId(),
              result.data.domBaunitCondition
            )
            .subscribe(() => {
              Swal.fire({
                text: 'No propiedad horizontal convertida exitosamente',
                icon: 'success',
                showConfirmButton: false,
                timer: 5000
              });
              this.refreshData.emit();
            });
        }
      });
  }

  disableCollapseMenu(row?: Operation): boolean {
    const mode = this.mode();

    const { appliedAlfa, appliedGeo } = row || {
      appliedAlfa: false,
      appliedGeo: false
    };

    if (mode === 1 && !appliedAlfa) {
      return false;
    }
    if (mode === 3 && !appliedGeo) {
      return false;
    }

    return true;
  }
}
