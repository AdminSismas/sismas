import {
  Component,
  inject,
  input,
  OnInit,
  signal,
  viewChild
} from '@angular/core';
import { AsyncPipe, DatePipe, NgClass } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { debounceTime, distinctUntilChanged, Observable, tap } from 'rxjs';

// recursos de vex
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '../../../../../@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';

// recursos de angular material
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';

// recursos de archivos locales
import { contentInfoProcedures } from '@shared/interfaces';
import {
  MY_DATE_FORMATS,
  TABLE_COLUMN_PROPERTIES,
  USERS_ACTIONS_ENABLED
} from '../../../../shared/constants/general/procedures.constant';
import {
  PAGE,
  PAGE_SIZE,
} from '@shared/constants';
import { ProceduresCollection } from '@shared/interfaces';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { ProceduresService } from '@shared/services/general/procedures.service';
import { PageProceduresData } from '@shared/interfaces';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { InformationPegeable } from '@shared/interfaces';
import { TaskResponseModel } from '@shared/interfaces';
import { DetailInformationTasksComponent } from 'src/app/pages/pages/my-work/tasks/components/detail-information-tasks/detail-information-tasks.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MODAL_LARGE,
  MODAL_SMALL,
  PAGE_SIZE_OPTION
} from '@shared/constants';
import { DocumentViewerWorkHistoricalComponent } from 'src/app/pages/pages/operation-support/procedures/work-historical/document-viewer-work-historical/document-viewer-work-historical.component';
import { environment } from '@environments/environments';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ReassignProcedureComponent } from 'src/app/apps/components/procedures/reassign-procedure/reassign-procedure.component';
import { AuthService } from '@core/auth/auth.service';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDividerModule } from '@angular/material/divider';
import { provideMomentDateAdapter } from '@angular/material-moment-adapter';
import moment from 'moment';
import 'moment/locale/es';
import Swal from 'sweetalert2';
import { ProcedureStatusPipe } from 'src/app/apps/components/tables/table-procedures/pipe/procedure-status.pipe';

interface MenuActions {
  label: string;
  icon: string;
  action: (row: contentInfoProcedures) => void;
  visible: boolean;
}

const beginAt = new Date('2025-01-01T00:00:00');

@Component({
  selector: 'vex-table-procedures',
  standalone: true,
  templateUrl: './table-procedures.component.html',
  styleUrl: './table-procedures.component.scss',
  animations: [fadeInUp400ms, stagger40ms],
  providers: [
    { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    provideMomentDateAdapter(
      {
        parse: {
          dateInput: 'DD/MM/YYYY'
        },
        display: {
          dateInput: 'DD/MM/YYYY',
          monthYearLabel: 'MMM YYYY',
          dateA11yLabel: 'DD/MM/YYYY',
          monthYearA11yLabel: 'MMMM YYYY'
        }
      },
      { useUtc: true }
    )
  ],
  imports: [
    AsyncPipe,
    DatePipe,
    FormsModule,
    NgClass,
    ReactiveFormsModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    // Vex
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    // Material
    MatButtonModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatDatepickerModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    // Custom
    ProcedureStatusPipe
  ]
})
export class TableProceduresComponent implements OnInit {
  // Injects
  private fBuilder = inject(FormBuilder);
  private dialog = inject(MatDialog);
  private proceduresService = inject(ProceduresService);
  private readonly layoutService = inject(VexLayoutService);
  private dateAdapter = inject(DateAdapter<Date>);
  private alertSnakbar = inject(MatSnackBar);
  private authService = inject(AuthService);

  // Constructor
  constructor() {
    this.dateAdapter.setLocale('es');
  }

  // Inputs
  urlTable = input<string>('');
  urlView = input<string>('');

  // Variables
  dataSource!: MatTableDataSource<contentInfoProcedures>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  layoutCtrl = new UntypedFormControl('boxed');
  contentInformations!: InformationPegeable;
  disabledEndDate = false;
  informationEjecution!: FormGroup;
  seeInfo = false;
  seeInfoDocument = false;
  procedureDetail: TaskResponseModel = new TaskResponseModel();
  userRole: string | undefined = this.getUserRole();

  readonly actions: MenuActions[] = [
    {
      label: 'Reasignar',
      icon: 'mat:swap_horiz',
      action: (row: contentInfoProcedures) =>
        this.actionButtons('reassign', row),
      visible: true
    },
    {
      label: 'Anular',
      icon: 'mat:block',
      action: (row: contentInfoProcedures) => this.actionButtons('cancel', row),
      visible: this.userRole !== 'USER_COORD'
    },
    {
      label: 'Prioridad',
      icon: 'mat:warning',
      action: (row: contentInfoProcedures) =>
        this.actionButtons('priority', row),
      visible: this.userRole !== 'USER_COORD'
    },
    {
      label: 'Quitar prioridad',
      icon: 'mat:assignment_returned',
      action: (row: contentInfoProcedures) =>
        this.actionButtons('no-priority', row),
      visible: this.userRole !== 'USER_COORD'
    }
  ];

  menuOptions = signal<MenuActions[]>([]);
  readonly comment = signal<string>('');
  gettedProcedureByResolution = signal<boolean>(false);

  page: number = PAGE;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  totalElements = 0;
  maxDate: Date = new Date(); // Fecha máxima permitida (hoy)
  maxStartDate: Date = new Date(); // Fecha máxima permitida para la fecha de inicio (un día antes de hoy)

  readonly paginator = viewChild.required(MatPaginator);
  readonly sort = viewChild.required(MatSort);
  readonly commentDialog = viewChild.required<ComponentType<unknown>>('commentDialog');
  readonly confirmDelete = viewChild.required<SwalComponent>('confirmDelete');
  readonly errorDelete = viewChild.required<SwalComponent>('errorDelete');
  readonly commentError = viewChild.required<SwalComponent>('commentError');
  readonly successDelete = viewChild.required<SwalComponent>('successDelete');
  readonly successReassign = viewChild.required<SwalComponent>('successReassign');
  readonly errorReassign = viewChild.required<SwalComponent>('errorReassign');
  readonly successChangePriority = viewChild.required<SwalComponent>('successChangePriority');
  readonly errorChangePriority = viewChild.required<SwalComponent>('errorChangePriority');


  get visibleColumns() {
    const validUser = this.userRole
      ? USERS_ACTIONS_ENABLED.includes(this.userRole)
      : false;

    const columnsFiltered = this.columns.filter((column) => {
      if (this.urlTable() !== environment.active) {
        return column.visible && column.property !== 'actions';
      }
      return column.visible && (column.property !== 'actions' || validUser);
    });

    return columnsFiltered.map((column) => column.property);
  }

  /* ============== METHODS ============== */
  /* ------- Meth. Lifecycle Hooks ------- */
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.initForm();
    this.executionCodeValidate();
    this.individualNumberPartValid();

    this.maxStartDate = this.getOneDayBefore(new Date());

    // Validacion de fechas
    this.beginAtgreaterThanDate();
    this.beginAtEFormGreaterThanDate();
    this.defaultTableData();
  }

  getOneDayBefore(date: Date): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - 1);
    return result;
  }

  /**
   * Init information address form
   */
  private initForm(): void {
    this.informationEjecution = this.fBuilder.group({
      beginAtForm: this.fBuilder.control(null, [Validators.required]),
      beginAtEForm: this.fBuilder.control(null, [Validators.required]),
      executionCodeForm: this.fBuilder.control(0, [
        Validators.pattern(/^[0-9]*$/)
      ]), // Solo letras y permite espacio
      individualNumberPartForm: this.fBuilder.control(null, [
        Validators.pattern(/^[0-9]*$/)
      ]),
      resolutionNumber: ['', [Validators.pattern(/^[0-9]*$/)]],
      resolutionYear: [
        '',
        [
          Validators.pattern(/^[0-9]*$/),
          Validators.max(new Date().getFullYear())
        ]
      ]
    });
    this.beginAtForm?.setValue(beginAt);
    this.beginAtEForm?.setValue(new Date());
  }

  /* ------- Meth. HTML ------- */
  toggleColumnVisibility(
    column: TableColumn<contentInfoProcedures>,
    event: Event
  ) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  getUserRole(): string | undefined {
    const decodeToken = this.authService.getDecodedToken();
    if (decodeToken) {
      return decodeToken.role;
    }
  }

  get columns() {
    return TABLE_COLUMN_PROPERTIES.filter((column) => {
      if (column.property === 'status' && this.urlTable() !== environment.finished ) {
        return false;
      }
      return true;
    });
  }

  refreshInformationpaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    const data = this.objectParameters();
    this.getDataFromProceduresService(data);
  }

  informationDetail(value: ProceduresCollection) {
    if (this.urlView() !== '') {
      this.dialog.open(DocumentViewerWorkHistoricalComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: { url: this.urlView() }
      });
    } else {
      this.proceduresService
        .viewDetailIdProcedures(+value.executionId!)
        .subscribe((result) => {
          this.procedureDetail = result;
          this.seeTaskProperty(this.procedureDetail, +value.executionId!);
        });
    }
  }

  seeTaskProperty(value: TaskResponseModel, taskId: number): void {
    this.dialog.open(DetailInformationTasksComponent, {
      ...MODAL_SMALL,
      data: { taskId: taskId, value }
    });
  }

  public beginAtgreaterThanDate() {
    this.beginAtForm?.valueChanges
      .pipe(
        debounceTime(100), // Espera 500 ms después del último cambio
        distinctUntilChanged(),
        tap(() => {
          const beginAtComparation = this.beginAtForm?.value
            ? new Date(this.beginAtForm?.value)
            : null;
          const beginAtEComparation = this.beginAtEForm?.value
            ? new Date(this.beginAtEForm?.value)
            : null;

          if (beginAtComparation && beginAtEComparation) {
            if (beginAtComparation.getTime() < beginAtEComparation.getTime()) {
              // this.beginAtForm?.setErrors(null);
              // this.beginAtEForm?.reset();
              this.beginAtEForm?.markAsTouched();
              this.beginAtEForm?.markAsUntouched();
            } else {
              this.beginAtForm?.setErrors({ dateComparison: true });
            }
          }
        })
      )
      .subscribe();
  }

  public beginAtEFormGreaterThanDate() {
    this.beginAtEForm?.valueChanges
      .pipe(
        debounceTime(100), // Espera 100ms después del último cambio
        distinctUntilChanged(),
        tap(() => {
          const beginAtDate = this.beginAtForm?.value
            ? new Date(this.beginAtForm.value)
            : null;
          const beginAtEDate = this.beginAtEForm?.value
            ? new Date(this.beginAtEForm.value)
            : null;

          if (beginAtDate && beginAtEDate) {
            if (beginAtEDate.getTime() > beginAtDate.getTime()) {
              this.beginAtEForm?.setErrors(null);
            } else {
              this.beginAtEForm?.setErrors({ dateComparison: true });
            }
          }
        })
      )
      .subscribe();
  }

  public executionCodeValidate() {
    this.executionCodeForm?.valueChanges
      .pipe(
        debounceTime(300), // Espera 500 ms después del último cambio
        distinctUntilChanged(), // Solo emite cuando el valor cambia
        tap((value) => {
          if (value !== '' && value !== 0 && value !== null) {
            this.individualNumberPartForm?.disable();
            // this.individualNumberPartForm?.reset();
            this.seeInfo = true;
          } else {
            this.individualNumberPartForm?.enable();
            // this.individualNumberPartForm?.reset();
            this.seeInfo = false;
          }
        })
      )
      .subscribe();
  }

  public individualNumberPartValid() {
    this.individualNumberPartForm?.valueChanges
      .pipe(
        debounceTime(300), // Espera 300 ms después del último cambio
        distinctUntilChanged(), // Solo emite cuando el valor cambia

        tap((value) => {
          if (value !== '' && value !== 0 && value !== null) {
            // Deshabilitar el campo sin resetear su valor
            this.executionCodeForm?.disable();
            this.seeInfoDocument = true;
          } else {
            // Habilitar el campo sin resetear su valor
            this.executionCodeForm?.enable();
            this.seeInfoDocument = false;
          }
        })
      )
      .subscribe();
  }

  public defaultTableData() {
    this.gettedProcedureByResolution.set(false);
    this.executionCodeForm?.setValue(0);

    this.individualNumberPartForm?.setValue('');
    const formValue: PageProceduresData = {
      page: this.page,
      size: this.pageSize,
      beginAt: this.formatDate(beginAt),
      beginAtE: this.formatDate(new Date()),
      executionCode: '0',
      individualNumber: ''
    };
    // this.objectParameters();
    this.getDataFromProceduresService(formValue);
  }

  searchByPersonOrFiled(): void {
    const data = this.objectParameters();
    this.getDataFromProceduresService(data);
  }

  searchByResolution(): void {
    const { resolutionNumber, resolutionYear } =
      this.informationEjecution.value;

    if (!resolutionNumber || !resolutionYear) {
      Swal.fire({
        icon: 'error',
        text: 'Debe ingresar el número y el año de la resolución',
        timer: 5000,
        showConfirmButton: false,
        timerProgressBar: true
      });
      return;
    }

    if (resolutionYear > new Date().getFullYear()) {
      Swal.fire({
        icon: 'error',
        text: 'El año de la resolución no puede ser mayor al año actual',
        timer: 5000,
        showConfirmButton: false,
        timerProgressBar: true
      });
      return;
    }

    if (resolutionNumber < 1) {
      Swal.fire({
        icon: 'error',
        text: 'El número de la resolución no puede ser menor a 1',
        timer: 5000,
        showConfirmButton: false,
        timerProgressBar: true
      });
      return;
    }


    this.proceduresService
      .getProcedureByResolution(resolutionNumber, resolutionYear)
      .subscribe((result) => {
        this.dataSource.data = [new contentInfoProcedures(result)];
        this.gettedProcedureByResolution.set(true);
      });
  }

  revertResolutionSearch(): void {
    this.informationEjecution.get('resolutionNumber')?.setValue('');
    this.informationEjecution.get('resolutionYear')?.setValue('');
    this.defaultTableData();
  }

  /* ------- Meth. Common ------- */
  objectParameters(): PageProceduresData {
    const formValue: PageProceduresData = {
      page: this.page,
      size: this.pageSize,
      beginAt: this.beginAtForm?.value
        ? this.formatDate(this.beginAtForm.value)
        : this.formatDate(beginAt),
      beginAtE: this.beginAtEForm?.value
        ? this.formatDate(this.beginAtEForm.value)
        : this.formatDate(new Date()),
      executionCode: this.executionCodeForm?.value
        ? this.executionCodeForm?.value
        : 0,
      individualNumber: this.individualNumberPartForm?.value
        ? this.individualNumberPartForm?.value
        : ''
    };

    return formValue;
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  private formatDate(date?: Date): string {
    if (!date) return '';

    return moment(date).locale('es').format('DD/MM/YYYY');
  }

  /* ------- Meth. Modal load file ------- */

  /* ------- Meth. Services ------- */
  getDataFromProceduresService(data: PageProceduresData) {
    this.proceduresService
      .getFilterTableEjecutionService(data, this.urlTable() ?? '')
      .subscribe({
        next: (result) => {
          this.captureInformationSubscribe(result);
        },
        error: (error) => {
          this.alertSnakbar.open(
            'Hubo un error, verifique la información de los filtros',
            'Close',
            {
              duration: 10000,
              horizontalPosition: 'center'
            }
          );
          console.error('Hubo un error al obtener los datos: ', error);
        }
      });
  }

  captureInformationSubscribe(data: InformationPegeable) {
    this.contentInformations = data;
    this.captureInformationProceduresData();
  }

  captureInformationProceduresData() {
    let data: contentInfoProcedures[];
    if (
      this.contentInformations != null &&
      this.contentInformations.content != null
    ) {
      data = this.contentInformations.content.map(
        (row: ProceduresCollection) =>
          new contentInfoProcedures({
            ...row,
            processName: row.process?.name
          })
      );
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

  actionButtons(action: string, row: ProceduresCollection): void {
    switch (action) {
      case 'reassign':
        this.reassignProcedure(row);
        break;
      case 'cancel':
        this.addComment(row);
        break;
      case 'priority':
        this.priorityProcedure(row);
        break;
      case 'no-priority':
        this.priorityProcedure(row);
        break;
    }
  }

  priorityProcedure(row: ProceduresCollection) {
    if (!this.userRole || this.userRole === 'USER_COORD') return;

    this.proceduresService.changePriority(row.executionId!).subscribe({
      next: () => {
        this.successChangePriority().fire();
        this.defaultTableData();
      },
      error: () => {
        this.errorChangePriority().fire();
      }
    });
  }

  setComment(event: Event): void {
    if (!event.target) return;

    const value = (event.target as HTMLInputElement).value;
    this.comment.set(value);
  }

  addComment(row: ProceduresCollection) {
    if (!this.userRole || this.userRole === 'USER_COORD') return;

    this.confirmDelete().fire().then((result) => {
      if (result.isConfirmed) {
        this.dialog
          .open(this.commentDialog(), {
            ...MODAL_SMALL
          })
          .afterClosed()
          .subscribe((response: boolean) => {
            if (response) {
              const comment = this.comment();
              if (!comment) return this.commentError().fire();
              this.proceduresService
                .commentProcedure(row.executionId!, comment)
                .subscribe({
                  next: () => {
                    this.cancelProcedure(row.executionId!);
                  },
                  error: (error: HttpErrorResponse) => {
                    this.errorDelete().fire();
                    throw error.message;
                  }
                });
            }
          });
      }
    });
  }

  cancelProcedure(executionId: number) {
    this.proceduresService.cancelProcedure(executionId).subscribe({
      next: () => {
        const data = this.objectParameters();
        this.getDataFromProceduresService(data);
        this.successDelete().fire();
      },
      error: (error: HttpErrorResponse) => {
        this.errorDelete().fire();
        throw error.message;
      }
    });
  }

  reassignProcedure(row: ProceduresCollection) {
    if (!this.userRole || !USERS_ACTIONS_ENABLED.includes(this.userRole))
      return;

    this.dialog
      .open(ReassignProcedureComponent, {
        ...MODAL_SMALL,
        data: {
          executionId: row.executionId
        }
      })
      .afterClosed()
      .subscribe({
        next: (response: string | undefined) => {
          if (response === 'success') {
            this.successReassign().fire();
            return;
          }

          if (response === 'error') {
            this.errorReassign().fire();
            return;
          }
        }
      });
  }

  filteredActions(row: contentInfoProcedures): void {
    if (!row.bpmPriority || row.bpmPriority === 1) {
      return this.menuOptions.set(
        this.actions.filter(
          (action) => action.visible && action.label !== 'Quitar prioridad'
        )
      );
    }

    return this.menuOptions.set(
      this.actions.filter(
        (action) => action.visible && action.label !== 'Prioridad'
      )
    );
  }

  get beginAtForm() {
    return this.informationEjecution.get('beginAtForm');
  }
  get beginAtEForm() {
    return this.informationEjecution.get('beginAtEForm');
  }
  get executionCodeForm() {
    return this.informationEjecution.get('executionCodeForm');
  }
  get individualNumberPartForm() {
    return this.informationEjecution.get('individualNumberPartForm');
  }
}
