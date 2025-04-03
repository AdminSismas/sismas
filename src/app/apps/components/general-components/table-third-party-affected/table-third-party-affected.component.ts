import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnDestroy,
  OnInit,
  signal,
  ViewChild
} from '@angular/core';
import { MatIcon, MatIconModule } from '@angular/material/icon';
import { getRandomInt } from '../../../utils/general';
import { MatDialog } from '@angular/material/dialog';
import { ThirdPartyAffectedParticipant } from '../../../interfaces/general/content-info';
import { ParticipantTableDialogComponent } from '../../bpm/participant-table-dialog/participant-table-dialog.component';
import {
  MODAL_MEDIUM,
  PAGE,
  PAGE_OPTION_UNIQUE_7,
  TABLE_COLUMN_PRINCIPANTS_TABLE_READONLY
} from '../../../constants/general/constants';
import { ProcessParticipant } from '../../../interfaces/bpm/process-participant';
import { ParticipantsServiceService } from '../../../services/users/participants-service.service';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { MatMenu, MatMenuContent, MatMenuItem, MatMenuModule, MatMenuTrigger } from '@angular/material/menu';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { TableColumn } from '@vex/interfaces/table-column.interface';

import { NgClass } from '@angular/common';
import { MatButtonModule, MatIconButton } from '@angular/material/button';
import { Observable, ReplaySubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import { Pegeable } from '../../../interfaces/general/pegeable.model';
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
    FluidMinHeightDirective,
    NgClass
  ],
  templateUrl: './table-third-party-affected.component.html',
  styleUrl: './table-third-party-affected.component.scss'
})
export class TableThirdPartyAffectedComponent implements OnInit, AfterViewInit, OnDestroy {

  @Input({ required: true }) public executionId: string = '';
  @Input({ required: true }) public readOnly: boolean = true;

  id: string = getRandomInt(1358879).toString();
  contentInformation!: InformationPegeable;

  page = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_OPTION_UNIQUE_7;
  pageSizeOptions: number[] = [PAGE_OPTION_UNIQUE_7];
  dataSource!: MatTableDataSource<ProcessParticipant>;
  columns: TableColumn<ProcessParticipant>[] = TABLE_COLUMN_PRINCIPANTS_TABLE_READONLY;
  subject$: ReplaySubject<ProcessParticipant[]> = new ReplaySubject<ProcessParticipant[]>(1);
  data$: Observable<ProcessParticipant[]> = this.subject$.asObservable();

  private participantsService: ParticipantsServiceService = inject(ParticipantsServiceService);
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private dialog: MatDialog = inject(MatDialog);

  existThirdPartyAffected = signal(false);

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  constructor() {
    this.destroyRef.onDestroy(() => {
    });
  }

  ngOnInit() {
    if (this.id?.length > 0) {
      this.id =
        this.id + getRandomInt(1345789) + 'TableThirdPartyAffectedComponent444' + getRandomInt(10);
    } else {
      this.id = getRandomInt(987541) + 'TableThirdPartyAffectedComponent44' + getRandomInt(10);
    }

    this.dataSource = new MatTableDataSource();
    this.getExistThirdPartyAffected();

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    this.data$
      .pipe(filter<ProcessParticipant[]>(Boolean))
      .subscribe((participants) => {
        this.dataSource.data = participants;
      });

    this.participantsService.chargeInfoSubject$.subscribe((result: boolean | null) => {
      if (result !== null && result) {
        this.obtainInformationThirdPartyAffected();
      }
      return;
    });


    this.obtainInformationThirdPartyAffected();
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  executeOpenThirdPartyAffected() {
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
    this.participantsService.getExistThirdPartyAffected(this.executionId)
      .subscribe((responseThirdPartyAffected: boolean) => {
        this.participantsService.changeInfoParticipants(responseThirdPartyAffected);
        this.existThirdPartyAffected.set(responseThirdPartyAffected);
      });
  }

  onThirdPartyAffectedTrue() {
    let obj: ThirdPartyAffectedParticipant = { executionId: this.executionId, thirdPartyAffected: true };
    this.dialog.open(ParticipantTableDialogComponent, {
     ...{ maxWidth: '100%', width: '80%', minHeight: 'auto' },
      disableClose: true,
      data: obj
    }).afterClosed()
      .subscribe((result: ProcessParticipant[]) => {
        this.participantsService.getExistThirdPartyAffected(this.executionId)
          .subscribe((response: boolean) => {
            this.participantsService.changeInfoParticipants(response);
            this.existThirdPartyAffected.set(response);
          });
      });
  }

  obtainInformationThirdPartyAffected() {
    this.participantsService.getAllThirdPartyAffected(this.executionId).subscribe({
      next: (result: ProcessParticipant[]) => this.captureInformationThirdPartyAffectedTable(result),
      error: () => this.captureInformationSubscribeError()
    });
  }

  captureInformationThirdPartyAffectedTable(result: ProcessParticipant[]) {
    if (!result || result?.length <= 0) {
      this.captureInformationSubscribeError();
      return;
    }
    this.contentInformation = new InformationPegeable(
      result?.length / PAGE_OPTION_UNIQUE_7, result?.length, false,
      result?.length, result?.length, true, result?.length > 0,
      result,
      new Pegeable(this.page, result?.length / PAGE_OPTION_UNIQUE_7)
    );
    this.captureInformationData();
  }

  captureInformationSubscribeError(): void {
    this.contentInformation = new InformationPegeable();
    this.dataSource.data = [];
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
    if (participant && participant.participationId > 0 && this.executionId) {
      let participationId = participant.participationId;
      this.participantsService.deleteParticipantByExecutionId(this.executionId,
        participationId.toString()).subscribe({
        next: () => {
          this.confirmAction(
            () => this.obtainInformationThirdPartyAffected(),
            'Borrado Eliminado correctamente',
            'success'
          );
        },
        error: () => this.getAlertError('Error al tratar de eliminar el participante')
      });
    }
  }

  ngOnDestroy(): void {
  }

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  confirmAction(action: () => void, message: string,
                icon: SweetAlertIcon | undefined): void {
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

}
