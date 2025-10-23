import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { ThirdPartyAffectedParticipant } from '@shared/interfaces';
import { ParticipantTableDialogComponent } from '@shared/components';
import {
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_OPTION_UNIQUE,
  TABLE_COLUMN_PRINCIPANTS_TABLE_READONLY,
  TYPE_BUTTON_ONE,
  TYPE_OPERATION_CREATE
} from '../../../constants/general/constants';
import { ProcessParticipant } from '@shared/interfaces';
import { ParticipantsService } from '@shared/services';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { MatMenuModule } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { TableColumn } from '@vex/interfaces/table-column.interface';

import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { InformationPegeable } from '@shared/interfaces';
import { Pegeable } from '@shared/interfaces';
import { FluidMinHeightDirective } from '../../../directives/fluid-min-height.directive';
import { UntypedFormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'vex-table-third-party-affected',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ],
  imports: [
    MatButtonModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    FluidMinHeightDirective,
    NgClass
  ],
  templateUrl: './table-third-party-affected.component.html',
  styleUrl: './table-third-party-affected.component.scss'
})
export class TableThirdPartyAffectedComponent implements OnInit, AfterViewInit {
  // Injects
  private dialog: MatDialog = inject(MatDialog);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private participantsService = inject(ParticipantsService);

  // Inputs
  executionId = input.required<string>();
  readOnly = input(false, {
    transform: (value: string | boolean) => {
      switch (value) {
        case '':
          return true;
        case 'false':
          return false;
        case 'true':
          return true;
        default:
          if (typeof value === 'boolean') {
            return value;
          }
          return false;
      }
    }
  });

  // Signals
  existThirdPartyAffected = signal(false);
  dataSource = signal<MatTableDataSource<ProcessParticipant>>(
    new MatTableDataSource()
  );

  contentInformation!: InformationPegeable;

  page = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_OPTION_UNIQUE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  columns: TableColumn<ProcessParticipant>[] =
    TABLE_COLUMN_PRINCIPANTS_TABLE_READONLY;
  subject$: ReplaySubject<ProcessParticipant[]> = new ReplaySubject<
    ProcessParticipant[]
  >(1);
  data$: Observable<ProcessParticipant[]> = this.subject$.asObservable();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  ngOnInit() {
    this.getExistThirdPartyAffected();

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    this.data$
      .pipe(filter<ProcessParticipant[]>(Boolean))
      .subscribe((participants) => {
        this.dataSource.update((dataSource) => {
          dataSource.data = participants;
          return dataSource;
        });
      });

    this.participantsService.chargeInfoSubject$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((result: boolean | null) => {
        if (result !== null && result) {
          this.obtainInformationThirdPartyAffected();
        }
        return;
      });

    this.obtainInformationThirdPartyAffected();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.update((dataSource) => {
        dataSource.paginator = this.paginator!;
        return dataSource;
      });
    }

    if (this.sort) {
      this.dataSource.update((dataSource) => {
        dataSource.sort = this.sort!;
        return dataSource;
      });
    }
  }

  onFilterChange(value: string): void {
    if (!this.dataSource()) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.update((dataSource) => {
      dataSource.filter = value;
      return dataSource;
    });
  }

  openThirdPartyAffected() {
    if (!this.existThirdPartyAffected()) {
      this.onThirdPartyAffectedTrue();
      return;
    }
    this.confirmAction(
      () => this.onThirdPartyAffectedTrue(),
      'Actualmente hay terceros afectados en el tramite,¿Deseas agregar alguno nuevo?',
      'info'
    );
  }

  getExistThirdPartyAffected() {
    this.participantsService
      .getExistThirdPartyAffected(this.executionId())
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((responseThirdPartyAffected: boolean) => {
        this.participantsService.changeInfoParticipants(
          responseThirdPartyAffected
        );
        this.existThirdPartyAffected.set(responseThirdPartyAffected);
      });
  }

  onThirdPartyAffectedTrue() {
    const obj: ThirdPartyAffectedParticipant = {
      executionId: this.executionId(),
      thirdPartyAffected: true
    };
    this.dialog
      .open(ParticipantTableDialogComponent, {
        ...{ maxWidth: '100%', width: '80%', minHeight: 'auto' },
        disableClose: true,
        data: obj
      })
      .afterClosed()
      .subscribe(() => {
        this.participantsService
          .getExistThirdPartyAffected(this.executionId())
          .subscribe((response: boolean) => {
            this.participantsService.changeInfoParticipants(response);
            this.existThirdPartyAffected.set(response);
          });
      });
  }

  obtainInformationThirdPartyAffected() {
    this.participantsService
      .getAllThirdPartyAffected(this.executionId())
      .subscribe({
        next: (result: ProcessParticipant[]) =>
          this.captureInformationThirdPartyAffectedTable(result),
        error: () => this.captureInformationSubscribeError()
      });
  }

  captureInformationThirdPartyAffectedTable(result: ProcessParticipant[]) {
    if (!result || result?.length <= 0) {
      this.captureInformationSubscribeError();
      return;
    }
    this.contentInformation = new InformationPegeable(
      result?.length / PAGE_OPTION_UNIQUE,
      result?.length,
      false,
      result?.length,
      result?.length,
      true,
      result?.length > 0,
      result,
      new Pegeable(this.page, result?.length / PAGE_OPTION_UNIQUE)
    );
    this.captureInformationData();
  }

  captureInformationSubscribeError(): void {
    this.contentInformation = new InformationPegeable();
    this.dataSource.update((dataSource) => {
      dataSource.data = [];
      return dataSource;
    });
  }

  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.obtainInformationThirdPartyAffected();
  }

  captureInformationData(): void {
    let data: ProcessParticipant[];
    if (this.contentInformation == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformation?.content != null) {
      data = this.contentInformation.content;
      data = data.map((row: ProcessParticipant) => new ProcessParticipant(row));
      this.subject$.next(data);
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

  deleteInformation(participant: ProcessParticipant): void {
    if (participant && participant.participationId > 0 && this.executionId()) {
      const participationId = participant.participationId;
      this.participantsService
        .deleteParticipantByExecutionId(
          this.executionId(),
          participationId.toString()
        )
        .subscribe({
          next: () => {
            this.confirmAction(
              () => this.obtainInformationThirdPartyAffected(),
              'Borrado Eliminado correctamente',
              'success'
            );
          },
          error: () =>
            this.getAlertError('Error al tratar de eliminar el participante')
        });
    }
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  confirmAction(
    action: () => void,
    message: string,
    icon: SweetAlertIcon | undefined
  ): void {
    Swal.fire({
      text: message,
      icon: icon,
      showConfirmButton: true,
      showDenyButton: true,
      confirmButtonText: `Aceptar`,
      denyButtonText: `Cerrar`
    }).then((result) => {
      if (result.isConfirmed) {
        action();
      }
    });
  }

  getAlertError(text: string) {
    Swal.fire({
      title: '¡Error!',
      text: text,
      icon: 'error',
      showConfirmButton: false,
      timer: 2000
    }).then();
  }

  successAlert(message: string) {
    Swal.fire({
      text: message,
      icon: 'success',
      timer: 10000,
      confirmButtonColor: '#3085d6',
      confirmButtonText: 'Aceptar'
    });
  }

  autoThirdPartyAffected() {
    this.participantsService
      .getAutoThirdPartyAffected(this.executionId())
      .subscribe(() => {
        const message = 'Se han obtenido todos los terceros afectados';
        this.successAlert(message);
        this.obtainInformationThirdPartyAffected();
      });
  }

  protected readonly TYPE_OPERATION_CREATE = TYPE_OPERATION_CREATE;
  protected readonly TYPE_BUTTON_ONE = TYPE_BUTTON_ONE;
}
