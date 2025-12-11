import {
  Component,
  computed,
  effect,
  inject,
  OnDestroy,
  OnInit,
  viewChild
} from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { PROCEDURE_STATE_COLUMNS } from '../../../../constants/ticket-offce/general-services/procedure-state-columns.constants';
import {
  ProcedureState,
  ProcedureStateEnum,
  ProcedureStateResponse
} from '../../../../interfaces/ticket-office/general-services';
import { ProcedureStateTableService } from '../../../../services/ticket-office/general-services/procedure-state-table.service';
import { toSignal } from '@angular/core/rxjs-interop';
import { DatePipe } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  BehaviorSubject,
  debounceTime,
  map,
  Subscription,
  switchMap
} from 'rxjs';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import {
  MODAL_LARGE,
  PAGE_SIZE,
  PAGE_SIZE_OPTION
} from '@shared/constants/constants';
import { MatDialog } from '@angular/material/dialog';
import { ViewCertificateComponent } from '../view-certificate/view-certificate.component';
import { MatTooltipModule } from '@angular/material/tooltip';
import Swal from 'sweetalert2';

@Component({
  selector: 'procedure-state-table',
  standalone: true,
  imports: [
    DatePipe,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    ReactiveFormsModule,
    MatTooltipModule
  ],
  templateUrl: './procedure-state-table.component.html',
  styleUrl: './procedure-state-table.component.scss'
})
export class ProcedureStateTableComponent implements OnInit, OnDestroy {
  /* ---- Properties ---- */
  columns = PROCEDURE_STATE_COLUMNS;
  filterSubscription: undefined | Subscription;

  /* ---- Injects ---- */
  procedureStateTableService = inject(ProcedureStateTableService);
  dialog = inject(MatDialog);

  /* ---- RxJs ---- */
  private readonly refresh$ = new BehaviorSubject<void>(undefined);
  private readonly data$ = this.refresh$.pipe(
    switchMap(() => this.procedureStateTableService.getProcedureStateList())
  );

  /* ---- Signals ---- */
  stateDataSource = toSignal<MatTableDataSource<ProcedureStateResponse>>(
    this.data$.pipe(
      map((data) => this.addFormattedStatus(data)),
      map((data) => new MatTableDataSource<ProcedureStateResponse>(data))
    )
  );

  /* ---- Controls ---- */
  searchInput = new FormControl('');

  /* ---- Computed ---- */
  displayedColumns = computed(() => {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  });

  /* ---- ViewChilds ---- */
  sort = viewChild(MatSort);
  paginator = viewChild(MatPaginator);

  /* ---- Effects ---- */
  sortAndPaginateEffect() {
    effect(() => {
      if (!this.stateDataSource() || !this.sort() || !this.paginator()) return;

      this.stateDataSource()!.sort = this.sort()!;
      this.stateDataSource()!.paginator = this.paginator()!;
    });
  }

  /* ---- Constructor ---- */
  constructor() {
    this.sortAndPaginateEffect();
  }

  /* ---- Lifecycle Hooks ---- */
  ngOnInit(): void {
    this.filterSubscription = this.searchInput.valueChanges
      .pipe(debounceTime(500))
      .subscribe((value) => {
        if (!this.stateDataSource()) return;
        this.stateDataSource()!.filter = value?.trim().toLowerCase() ?? '';
      });
  }

  ngOnDestroy(): void {
    if (!this.filterSubscription) return;
    this.filterSubscription.unsubscribe();
  }

  /* ---- Methods ---- */
  onClickButtonAction(row: ProcedureStateResponse) {
    if (this.disabledViewButton(row.status) || row.status === 'FAILED') {
      this.retryProcedure(row.id);
      return;
    }

    this.dialog.open(ViewCertificateComponent, {
      ...MODAL_LARGE,
      data: { id: row.id }
    });
  }

  private retryProcedure(id: string) {
    this.procedureStateTableService.retryProcedure(id).subscribe(() => {
      Swal.fire({
        icon: 'success',
        text: `El proceso número ${id} se ha solicitado de nuevo correctamente`,
        showConfirmButton: false,
        timer: 20000
      });
      this.refreshServiceStates();
    });
  }

  private addFormattedStatus(
    data: ProcedureStateResponse[]
  ): ProcedureStateResponse[] {
    return data.map((item) => ({
      ...item,
      formattedStatus: ProcedureStateEnum[item.status]
    }));
  }

  disabledViewButton(status: ProcedureState): boolean {
    return status === 'PENDING' || status === 'PROCESSING';
  }

  refreshServiceStates() {
    this.refresh$.next(undefined);
  }

  /* ---- Getters ---- */
  get PAGE_SIZE_OPTION() {
    return PAGE_SIZE_OPTION;
  }

  get PAGE_SIZE() {
    return PAGE_SIZE;
  }

  get TOTAL_ELEMENTS() {
    return this.stateDataSource()?.data.length ?? 0;
  }
}
