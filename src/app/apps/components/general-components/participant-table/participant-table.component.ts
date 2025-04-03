import {
  AfterViewInit,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnDestroy,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { NgClass } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { ComboxColletionComponent } from '../combox-colletion/combox-colletion.component';
import { FluidMinHeightDirective } from '../../../directives/fluid-min-height.directive';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  MODAL_DYNAMIC_HEIGHT,
  PAGE,
  PAGE_OPTION_UNIQUE_7,
  TABLE_COLUMN_PRINCIPANTS_TABLE
} from '../../../constants/general/constants';
import { Observable, ReplaySubject } from 'rxjs';
import { InfoPerson } from '../../../interfaces/information-property/info-person';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { InformationPersonService } from '../../../services/bpm/information-person.service';
import { MatDialog } from '@angular/material/dialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { filter } from 'rxjs/operators';
import {
  CreatePeopleComponent
} from '../../../../pages/pages/operation-support/people/create-people/create-people.component';
import { ParticipantsServiceService } from '../../../services/users/participants-service.service';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import { Pegeable } from '../../../interfaces/general/pegeable.model';
import { PageSearchData } from '../../../interfaces/general/page-search-data.model';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { getRandomInt, validateVariable } from '../../../utils/general';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { ProcessParticipant } from 'src/app/apps/interfaces/bpm/process-participant';

@Component({
  selector: 'vex-participant-table',
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
    FormsModule,
    ReactiveFormsModule,
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    ComboxColletionComponent,
    FluidMinHeightDirective,
    FluidMinHeightDirective,
    NgClass
  ],
  templateUrl: './participant-table.component.html',
  styleUrl: './participant-table.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class ParticipantTableComponent implements OnInit, AfterViewInit, OnDestroy {

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformation!: InformationPegeable;

  @Input({ required: true }) public id: string = '';
  @Input() form: FormGroup | null = null;
  @Input({ required: true }) executionId = '';
  @Input({ required: true }) thirdPartyAffected: boolean = false;
  @Input() columns: TableColumn<ProcessParticipant>[] = TABLE_COLUMN_PRINCIPANTS_TABLE;

  @Output() processParticipants = new EventEmitter<ProcessParticipant[]>();


  page = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_OPTION_UNIQUE_7;
  pageSizeOptions: number[] = [PAGE_OPTION_UNIQUE_7];
  dataSource!: MatTableDataSource<ProcessParticipant>;

  subject$: ReplaySubject<ProcessParticipant[]> = new ReplaySubject<ProcessParticipant[]>(1);
  data$: Observable<ProcessParticipant[]> = this.subject$.asObservable();
  person!: InfoPerson | null;

  searchCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private readonly layoutService: VexLayoutService,
    private personService: InformationPersonService,
    private participantsService: ParticipantsServiceService,
    private dialog: MatDialog
  ) {

    this.destroyRef.onDestroy(() => {
    });
  }

  ngOnInit(): void {
    if (!this.executionId || this.executionId?.length <= 0) {
      return;
    }
    this.id = this.id + getRandomInt(12340) + this.executionId + 'ParticipantTableComponent1234';

    this.dataSource = new MatTableDataSource();
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    this.data$
      .pipe(filter<ProcessParticipant[]>(Boolean))
      .subscribe((participants) => {
        this.dataSource.data = participants;
        this.processParticipants.emit(participants);
      });

    this.participantsService.chargeInfoSubject$.subscribe((result: boolean | null) => {
      if (result !== null && result) {
        this.searchInformation();
      }
      return;
    });

    this.searchInformation();
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

  obtainInformationThirdPartyAffected() {
    this.participantsService.getAllThirdPartyAffected(this.executionId).subscribe({
      next: (result: ProcessParticipant[]) => this.captureInformationThirdPartyAffectedTable(result),
      error: () => this.captureInformationSubscribeError()
    });
  }

  obtainInformationParticipants() {
    this.participantsService.getAllParticipants(
      new PageSearchData(this.page, this.pageSize, this.executionId),
      this.executionId
    ).subscribe({
      next: (result: InformationPegeable) => this.captureInformationSubscribe(result),
      error: () => this.captureInformationSubscribeError()
    });
  }

  findParticipant() {
    const info = this.form?.value;
    if (!info || !info.typeNumberDocument || !validateVariable(info.typeNumberDocument) ||
      !info.numberID || !validateVariable(info.numberID)) {
      Swal.fire({
        text: 'Ingresar tipo documento o número de documento',
        icon: 'error',
        showConfirmButton: false,
        timer: 10000
      }).then();
      return;
    }
    this.getParticipant(info.numberID, info.typeNumberDocument, true);
  }

  addParticipantToList() {
    const typeParticipation = this.form?.get('typeParticipation')?.value;
    const person: InfoPerson | null = this.person;

    if (!person || !typeParticipation) {
      return;
    }
    const list = this.contentInformation?.content;
    if (list != null && list.length > 1) {
      const listPersonExist: ProcessParticipant[] = list.filter((user: ProcessParticipant) => user.individual.individualId === person?.individualId);
      if (listPersonExist && listPersonExist.length > 0) {
        Swal.fire({
          text: 'La persona que desea registrar como participante ya existe en el tramite',
          icon: 'error',
          showConfirmButton: false,
          timer: 10000
        }).then();
        return;
      }
    }

    const participant: ProcessParticipant = new ProcessParticipant();
    participant.participationId = 0;
    participant.bpmParticipation = typeParticipation;
    if (this.person) {
      participant.individual = new InfoPerson(this.person);
    }
    this.participantsService.saveParticipantByExecutionId(this.executionId, participant).subscribe({
      next: (result: ProcessParticipant) => {
        if (!result) {
          this.getAlertError('Error al guardar participante del proceso');
          return;
        }
        this.confirmAction(
          () => this.searchInformation(),
          'Participante Agregado correctamente',
          'success'
        );
      },
      error: () => this.getAlertError('Error al guardar participante del proceso')
    });
  }

  editParticipantToList(participant: ProcessParticipant) {
    if (!participant || !participant?.bpmParticipation || participant?.participationId <= 0) {
      this.getAlertError('Error al tratar de actualizar el participante');
      return;
    }
    const typeParticipation = this.form?.get('typeParticipation')?.value;
    const participantUpdate: ProcessParticipant = new ProcessParticipant(participant);
    participantUpdate.bpmParticipation = typeParticipation;
    this.participantsService.updateParticipantByExecutionId(this.executionId, participantUpdate).subscribe({
      next: (result: ProcessParticipant) => {
        if (!result) {
          this.getAlertError('Error al actualizar participante del proceso');
          return;
        }
        this.confirmAction(
          () => this.searchInformation(),
          'Participante Actualizado correctamente',
          'success'
        );
      },
      error: () => this.getAlertError('Error al actualizar participante del proceso')
    });
  }

  deleteInformation(participant: ProcessParticipant): void {
    if (participant && participant.participationId > 0 && this.executionId) {
      let participationId = participant.participationId;
      this.participantsService.deleteParticipantByExecutionId(this.executionId,
        participationId.toString()).subscribe({
        next: () => {
          this.confirmAction(
            () => this.searchInformation(),
            'Borrado Eliminado correctamente',
            'success'
          );
        },
        error: () => this.getAlertError('Error al tratar de eliminar el participante')
      });
    }
  }

  validateParticipants(result: InfoPerson | null, createPeople: boolean = true): void {
    if ((!result || result.individualId <= 0) && createPeople) {
      this.openCreatePeopleComponent();
      return;
    }

    if (!createPeople && (!result || result.individualId <= 0)) {
      this.person = null;
      this.form?.get('personCompleted')?.patchValue('');
    } else {
      this.captureInformationPersonData(result);
    }
    this.captureInformationData();
  }

  openCreatePeopleComponent(): void {
    const info = this.form?.value;
    this.person = null;
    this.form?.get('personCompleted')?.reset();
    this.dialog
      .open(CreatePeopleComponent, {
        ...MODAL_DYNAMIC_HEIGHT,
        disableClose: true,
        data: {
          domIndividualTypeNumber: info.typeNumberDocument,
          number: info.numberID,
          mode: 'create'
        }
      })
      .afterClosed()
      .subscribe((result: { number: string; individualTypeNumber: string }) => {
          this.getParticipant(result.number, result.individualTypeNumber, false);
        }
      );
  }

  getParticipant(number: string, individualTypeNumber: string, createPeople: boolean) {
    this.personService
      .getFindParticipantPersonByNumber(number, individualTypeNumber)
      .subscribe((result: InfoPerson) => this.validateParticipants(result, createPeople));
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformation = result;
    this.captureInformationData();
  }

  captureInformationPersonData(result: InfoPerson | null): void {
    if (result == null) {
      this.person = null;
      this.form?.get('personCompleted')?.patchValue('');
      return;
    }
    let fullName = null;
    if (result?.individualId && result.fullName) {
      this.person = result;
      fullName = result.fullName;
    }
    this.form?.get('personCompleted')?.patchValue(fullName);
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
      showConfirmButton: false,
      timer: 2000
    }).then((result) => {
      action();
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

  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.searchInformation();
  }

  searchInformation() {
    if (this.thirdPartyAffected) {
      this.obtainInformationThirdPartyAffected();
    } else {
      this.obtainInformationParticipants();
    }
  }

  ngOnDestroy(): void {
    if (this.subject$) {
      this.subject$.unsubscribe();
    }
  }
}
