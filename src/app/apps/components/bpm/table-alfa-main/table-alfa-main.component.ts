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
  ViewChild
} from '@angular/core';
import {
  LIST_SCHEMAS_CONTROL_CHANGES,
  LIST_SCHEMAS_CONTROL_TEMP,
  MODAL_LARGE,
  MODAL_MEDIUM, MODAL_MEDIUM_H90, MODAL_MIN_MEDIUM_ALL,
  PAGE,
  PAGE_SIZE_OPTION_UNIQUE,
  PAGE_SIZE_TABLE_UNIQUE,
  TABLE_ALFA_MAIN_OPERATION_COLUMN,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL
} from '../../../constants/general/constants';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { NgClass, NgIf } from '@angular/common';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { Observable, ReplaySubject } from 'rxjs';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import { SearchData } from '../../../interfaces/general/search-data.model';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { MatMenuModule } from '@angular/material/menu';
import { Operation } from '../../../interfaces/bpm/operation';
import {
  LayoutCardCadastralInformationPropertyComponentComponent
} from '../../information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import { ContentInfoSchema } from '../../../interfaces/general/content-info-schema';
import { filter } from 'rxjs/operators';
import { BpmCoreService } from '../../../services/bpm/bpm-core.service';
import { DifferenceChanges } from '../../../interfaces/bpm/difference-changes';
import { ViewChangesBpmOperationComponent } from '../view-changes-bpm-operation/view-changes-bpm-operation.component';
import { MatDividerModule } from '@angular/material/divider';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { CurrencyLandsPipe } from 'src/app/apps/pipes/currency-lands.pipe';
import {
  ModificationPropertyUnitsComponent
} from '../modification-property-units/modification-property-units.component';
import Swal from 'sweetalert2';
import { AlfaMainService } from '../../../services/bpm/core/alfa-main.service';
import {
  CONSTANT_TEXT_ALFA_MAIN_VIEW_CHANGE_ERROR_NO_CHANGE,
  CONSTANT_TEXT_ALFA_MAIN_VIEW_NO_CHANGE
} from '../../../constants/general/constantLabels';

@Component({
  selector: 'vex-table-alfa-main',
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
    NgIf,
    NgClass,
    MatMenuModule,
    MatDialogModule,
    MatDividerModule,
    SweetAlert2Module
  ],
  templateUrl: './table-alfa-main.component.html',
  styleUrl: './table-alfa-main.component.scss'
})
export class TableAlfaMainComponent
  implements OnInit, AfterViewInit, OnChanges {
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  @Input({ required: true }) contentInformations!: InformationPegeable;
  @Input({ required: true }) executionId!: string;
  @Input({ required: true }) mode = 1;
  @Input() resources: string[] = [];
  @Input() columns: TableColumn<Operation>[] = TABLE_ALFA_MAIN_OPERATION_COLUMN;

  @Output() refreshData = new EventEmitter<void>();

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  searchData!: SearchData;

  page = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE_TABLE_UNIQUE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION_UNIQUE;
  dataSource!: MatTableDataSource<Operation>;
  npnRemoving?: string;

  _contentInformations$: ReplaySubject<InformationPegeable> =
    new ReplaySubject<InformationPegeable>(0);
  contentInformations$: Observable<InformationPegeable> =
    this._contentInformations$.asObservable();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('confirmRemoveDialog', { static: true }) confirmRemoveDialog!: SwalComponent;
  @ViewChild('confirmDeleteDialog', { static: true }) confirmDeleteDialog!: SwalComponent;
  @ViewChild('confirmAddUpdateBaUnitHead', { static: true }) confirmAddUpdateBaUnitHead!: SwalComponent;

  constructor(
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private bpmCoreService: BpmCoreService,
    private alfaMainService: AlfaMainService
  ) {
  }

  get visibleColumns() {
    return this.columns
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
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
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
    if (this.contentInformations?.content != null) {
      data = this.contentInformations.content;
      // data = data.map((row: Operation) => new Operation(row));
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
          this.executionId,
          LIST_SCHEMAS_CONTROL_CHANGES,
          TYPE_INFORMATION_VISUAL
        )
      })
      .afterClosed();
  }

  viewChanges(operation: Operation): void {
    if (!operation || !operation?.baunitHead?.baunitIdE) {
      this.msgErrorConsultingAdministration(CONSTANT_TEXT_ALFA_MAIN_VIEW_NO_CHANGE);
      return;
    }
    this.bpmCoreService.viewChangesBpmOperationTemp(this.executionId, operation?.baunitHead?.baunitIdE).subscribe({
        error: () => this.messageChangesNoAvailable(),
        next: (result: DifferenceChanges[]) => {
          this.openDifferenceChangesProperty(
            result,
            this.executionId,
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
          this.executionId,
          LIST_SCHEMAS_CONTROL_TEMP,
          TYPE_INFORMATION_EDITION,
          '',
          this.resources
        )
      })
      .afterClosed();
  }

  removeInformation(operation: Operation): void {
    this.npnRemoving = operation.npnlike;
    this.confirmRemoveDialog.fire().then((result) => {
      if (result.isConfirmed) {
        this.bpmCoreService
          .clearPropertyBpmOperation(
            this.executionId,
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
      this.confirmDeleteDialog.fire().then((result) => {
        if (result.isConfirmed) {
          this.executeResultChangeTemporaryStateBeaUnitHead(operation);
        }
      });
    } else if (operation.operationType === 'DELETE') {
      this.confirmAddUpdateBaUnitHead.fire().then((result) => {
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
        this.executionId
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

    const data: DifferenceChanges[] = result.map((row: DifferenceChanges) =>
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
    this.msgErrorConsultingAdministration( CONSTANT_TEXT_ALFA_MAIN_VIEW_CHANGE_ERROR_NO_CHANGE);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }

  editCadastralUnits(row: Operation) {
    this.dialog.open(ModificationPropertyUnitsComponent, {
      ...MODAL_MEDIUM_H90,
      disableClose: true,
      data: {
        executionId: this.executionId,
        baunitIdE: row.baunitHead?.baunitIdE,
        npnMatrix: row.baunitHead!.cadastralNumber,
        resources: this.resources,
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

  // addRemoveOption(operationType: string): { text: string; icon: string } {
  //   if (operationType === 'UPDATE') {
  //     return { text: 'Borrar', icon: 'mat:delete' };
  //   }
  //   return { text: 'Reincorporar', icon: 'mat:recycling' };
  // }
}
