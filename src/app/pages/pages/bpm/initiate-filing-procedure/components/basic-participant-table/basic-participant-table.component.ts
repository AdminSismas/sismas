import {
  AfterViewInit,
  ChangeDetectionStrategy,
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
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import {
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE_TABLE_CADASTRAL,
  TABLE_COLUMN_BASIC_PRINCIPANTS
} from '../../../../../../apps/constants/constant';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { SelectionModel } from '@angular/cdk/collections';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { ProcessParticipant } from '../../../../../../apps/interfaces/bpm/process-participant';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatIconModule } from '@angular/material/icon';
import { NgClass, NgForOf, NgIf } from '@angular/common';
import { MatMenuModule } from '@angular/material/menu';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { filter } from 'rxjs/operators';
import {
  ComboxColletionComponent
} from '../../../../../../apps/components/combox-colletion/combox-colletion.component';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { InfoPerson } from '../../../../../../apps/interfaces/information-property/info-person';
import { InformationPersonService } from '../../../../../../apps/services/bpm/information-person.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { FluidMinHeightDirective } from '../../../../../../apps/directives/fluid-min-height.directive';

@Component({
  selector: 'vex-basic-participant-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    MatButtonModule,
    MatCheckboxModule,
    MatIconModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    NgForOf,
    NgIf,
    NgClass,
    MatMenuModule,
    VexPageLayoutContentDirective,
    ComboxColletionComponent,
    FluidMinHeightDirective,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    FluidMinHeightDirective
  ],
  templateUrl: './basic-participant-table.component.html',
  styleUrl: './basic-participant-table.component.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }]
})
export class BasicParticipantTableComponent implements OnInit, AfterViewInit, OnChanges {

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;

  @Input({ required: true }) form!: FormGroup;
  @Input() columns: TableColumn<ProcessParticipant>[] = TABLE_COLUMN_BASIC_PRINCIPANTS;
  @Output() processParticipants = new EventEmitter<ProcessParticipant[]>();

  page = PAGE;
  totalElements: number = 0;
  pageSize: number = PAGE_SIZE_TABLE_CADASTRAL;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  dataSource!: MatTableDataSource<ProcessParticipant>;
  selection = new SelectionModel<ProcessParticipant>(true, []);
  subject$: ReplaySubject<ProcessParticipant[]> = new ReplaySubject<ProcessParticipant[]>(1);
  data$: Observable<ProcessParticipant[]> = this.subject$.asObservable();
  participants: ProcessParticipant[] = [];
  person!: InfoPerson | null;

  searchCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild(MatPaginator, { static: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private snackbar: MatSnackBar,
    private readonly layoutService: VexLayoutService,
    private personService: InformationPersonService
  ) {
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    this.data$.pipe(filter<ProcessParticipant[]>(Boolean))
      .subscribe(
        (participants) => {
          this.dataSource.data = participants;
          this.processParticipants.emit(participants);
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
    console.log('prueba');
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  deleteInformations(participant: ProcessParticipant): void {
    this.participants.splice(
      this.participants.findIndex(
        (existingParticipants) => {
          return existingParticipants.individual.individualId === participant.individual.individualId;
        }),
      1
    );
    this.selection.deselect(participant);
    this.subject$.next(this.participants);
  }

  findParticipant() {
    const info = this.form.value;
    if (!info.typeNumberDocument || !info.numberID) {
      this.snackbar.open('Ingresar tipo documento o número de documento', undefined,
        { duration: 2000 });
      return;
    }

    this.personService.getFindPersonByNumber(info.numberID, info.typeNumberDocument)
      .subscribe(
        {
          error: (error: HttpErrorResponse) => {
            if (error.status == HttpStatusCode.NotFound) {
              this.person = null;
              this.form.get('personCompleted')?.patchValue('');
              this.snackbar.open('Persona No Existe', undefined,
                { duration: 2000 });
              return;
            }
            return throwError(() => error);
          },
          next: (result: InfoPerson) => this.captureInformationCadastralData(result)
        }
      );
  }

  captureInformationCadastralData(result: InfoPerson): void {
    let fullName = null;
    if (result?.individualId && result.fullName) {
      this.person = result;
      fullName = result.fullName;
    }
    this.form.get('personCompleted')?.patchValue(fullName);
  }

  addParticipantToList() {
    const typeParticipation = this.form.get('typeParticipation')?.value;
    if (!typeParticipation) {
      this.snackbar.open('Seleccionar tipo de participación', undefined,
        { duration: 2000 });
      return;
    }
    if (!this.person) {
      this.snackbar.open('Selecciona o buscar un persona para agregarla como participante', undefined,
        { duration: 2000 });
      return;
    }

    if (this.person.individualId) {
      let participant: ProcessParticipant = new ProcessParticipant();
      participant.participationId = 0;
      participant.bpmParticipation = typeParticipation;
      participant.individual = this.person;

      if (this.participants.length > 0) {
        const existParticipant = this.participants.find(pr => {
          return pr.individual.individualId == this.person?.individualId;
        });
        if (!existParticipant) {
          this.participants.unshift(participant);
          this.subject$.next(this.participants);
          return;
        }
        this.snackbar.open('Participante ya agregado', undefined,
          { duration: 2000 });
        return;
      }
      this.participants.unshift(participant);
      this.subject$.next(this.participants);
    }
  }
}
