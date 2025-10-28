// Angular framework
import {
  AfterViewInit,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output,
  ViewChild
} from '@angular/core';
import {
  ControlContainer,
  FormGroup,
  FormGroupDirective,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { filter } from 'rxjs/operators';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { NgClass, NgIf } from '@angular/common';
import { Observable, ReplaySubject, throwError } from 'rxjs';
import { SelectionModel } from '@angular/cdk/collections';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

// Vex
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { VexLayoutService } from '@vex/services/vex-layout.service';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

// Custom
import {
  ComboboxCollectionComponent
} from 'src/app/apps/components/general-components/combobox-collection/combobox-collection.component';
import {
  CreatePeopleComponent
} from 'src/app/pages/pages/operation-support/people/components/create-people/create-people.component';
import { FluidMinHeightDirective } from '../../../../../../apps/directives/fluid-min-height.directive';
import { InfoPerson } from '@shared/interfaces';
import { InformationPersonService } from '@shared/services';
import {
  MODAL_SMALL_LARGE,
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE_TABLE_CADASTRAL,
  TABLE_COLUMN_BASIC_PRINCIPALS
} from '../../../../../../apps/constants/general/constants';
import { ProcessParticipant } from '@shared/interfaces';

@Component({
  selector: 'vex-basic-participant-table',
  changeDetection: ChangeDetectionStrategy.OnPush,
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    FormsModule,
    NgClass,
    NgIf,
    ReactiveFormsModule,
    // Vex
    // Material
    MatButtonModule,
    MatCheckboxModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    // Custom
    ComboboxCollectionComponent,
    FluidMinHeightDirective,
    FluidMinHeightDirective
],
  templateUrl: './basic-participant-table.component.html',
  styleUrl: './basic-participant-table.component.scss',
  viewProviders: [
    { provide: ControlContainer, useExisting: FormGroupDirective }
  ]
})
export class BasicParticipantTableComponent
  implements OnInit, AfterViewInit
{
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;

  @Input({ required: true }) form!: FormGroup;
  @Input() columns: TableColumn<ProcessParticipant>[] =
    TABLE_COLUMN_BASIC_PRINCIPALS;
  @Output() processParticipants = new EventEmitter<ProcessParticipant[]>();

  page = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE_TABLE_CADASTRAL;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  dataSource!: MatTableDataSource<ProcessParticipant>;
  selection = new SelectionModel<ProcessParticipant>(true, []);
  subject$: ReplaySubject<ProcessParticipant[]> = new ReplaySubject<
    ProcessParticipant[]
  >(1);
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
    private personService: InformationPersonService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
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



  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  deleteInformations(participant: ProcessParticipant): void {
    this.participants.splice(
      this.participants.findIndex((existingParticipants) => {
        return (
          existingParticipants.individual.individualId ===
          participant.individual.individualId
        );
      }),
      1
    );
    this.selection.deselect(participant);
    this.subject$.next(this.participants);
  }

  findParticipant() {
    const info = this.form.value;
    if (!info.typeNumberDocument || !info.numberID) {
      this.snackbar.open(
        'Ingresar tipo documento o número de documento',
        'Aceptar',
        { duration: 10000 }
      );
      return;
    }

    this.personService
      .getFindPersonByNumber(info.numberID, info.typeNumberDocument)
      .subscribe({
        error: (error: HttpErrorResponse) => {
          if (error.status === HttpStatusCode.NotFound) {
            this.person = null;
            this.form.get('personCompleted')?.patchValue('');
            this.dialog
              .open(CreatePeopleComponent, {
                ...MODAL_SMALL_LARGE,
                disableClose: true,
                data: {
                  domIndividualTypeNumber: info.typeNumberDocument,
                  number: info.numberID,
                  mode: 'create'
                }
              })
              .afterClosed()
              .subscribe(
                (result: { number: string; individualTypeNumber: string }) => {
                  this.personService
                    .getFindPersonByNumber(
                      result.number,
                      result.individualTypeNumber
                    )
                    .subscribe({
                      next: (res: InfoPerson) =>
                        this.captureInformationCadastralData(res),
                      error: (error: HttpErrorResponse) => {
                        if (error.status === HttpStatusCode.NotFound) {
                          this.person = null;
                          this.form.get('personCompleted')?.patchValue('');
                        }
                        return throwError(() => error);
                      }
                    });
                }
              );
          }
          return throwError(() => error);
        },
        next: (result: InfoPerson) =>
          this.captureInformationCadastralData(result)
      });
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
      this.snackbar.open('Seleccionar tipo de participación', 'Aceptar', {
        duration: 10000
      });
      return;
    }
    if (!this.person) {
      this.snackbar.open(
        'Seleccionar o buscar una persona para agregarla como participante',
        undefined,
        { duration: 10000 }
      );
      return;
    }

    if (this.person.individualId) {
      const participant: ProcessParticipant = new ProcessParticipant();
      participant.participationId = 0;
      participant.bpmParticipation = typeParticipation;
      participant.individual = this.person;

      if (this.participants.length > 0) {
        const existParticipant = this.participants.find((pr) => {
          return pr.individual.individualId === this.person?.individualId;
        });
        if (!existParticipant) {
          this.participants.unshift(participant);
          this.subject$.next(this.participants);
          return;
        }
        this.snackbar.open('Participante ya agregado', 'Aceptar', {
          duration: 10000
        });
        return;
      }
      this.participants.unshift(participant);
      this.subject$.next(this.participants);
    }
  }
}
