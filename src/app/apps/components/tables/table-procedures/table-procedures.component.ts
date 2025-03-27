import {
  Component,
  Input,
  OnChanges,
  OnInit,
  SimpleChanges,
  ViewChild
} from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl,
  Validators
} from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import {
  debounceTime,
  distinctUntilChanged,
  Observable,
  Subscription,
  tap
} from 'rxjs';

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
import { contentInfoProcedures } from '../../../interfaces/general/content-info-procedures.model';
import {
  MY_DATE_FORMATS,
  PAGE,
  PAGE_SIZE,
  TABLE_COLUMN_PROPERTIES,
  USERS_ACTIONS_ENABLED
} from '../../../constants/general/procedures.constant';
import { ProceduresCollection } from '../../../interfaces/tables/procedures-progress.model';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { ProceduresService } from '../../../services/general/procedures.service';
import { PageProceduresData } from '../../../interfaces/general/page-procedures-data.model';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import { TaskResponseModel } from '../../../interfaces/bpm/task-response.model';
import { DetailInformationTasksComponent } from 'src/app/pages/pages/my-work/tasks/components/detail-information-tasks/detail-information-tasks.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import {
  MODAL_LARGE,
  MODAL_SMALL,
  PAGE_OPTION_10_20_50_100
} from '../../../constants/general/constants';
import { DocumentViewerWorkHistoricalComponent } from 'src/app/pages/pages/operation-support/procedures/work-historical/document-viewer-work-historical/document-viewer-work-historical.component';
import { environment } from 'src/environments/environments';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HttpErrorResponse } from '@angular/common/http';
import { ReassignProcedureComponent } from '../../procedures/reassign-procedure/reassign-procedure.component';
import { AuthService } from 'src/app/pages/pages/auth/login/services/auth.service';
import { ComponentType } from '@angular/cdk/overlay';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'vex-table-procedures',
  standalone: true,
  templateUrl: './table-procedures.component.html',
  styleUrl: './table-procedures.component.scss',
  animations: [fadeInUp400ms, stagger40ms],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
  imports: [
    CommonModule,
    FormsModule,
    NgClass,
    NgIf,
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
    MatTableModule
  ]
})
export class TableProceduresComponent implements OnInit, OnChanges {
  /* ============== ATRIBUTES ============== */
  /* ============== ATRIBUTES ============== */
  @Input() urlTable?: string = '';
  @Input() urlView?: string = '';

  dataSource!: MatTableDataSource<ProceduresCollection>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  layoutCtrl = new UntypedFormControl('boxed');
  contentInformations!: InformationPegeable;
  disabledEndDate = false;
  informationEjecution!: FormGroup;
  seeInfo = false;
  seeInfoDocument = false;
  public procedureDetail: TaskResponseModel = new TaskResponseModel();
  userRole: string | undefined = this.getUserRole();
  comment = '';

  // Array para almacenar las suscripciones
  private subscriptions: Subscription | undefined[] = [];

  @Input()
  page: number = PAGE;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_OPTION_10_20_50_100;
  totalElements = 0;
  maxDate: Date = new Date(); // Fecha máxima permitida (hoy)
  maxStartDate: Date = new Date(); // Fecha máxima permitida para la fecha de inicio (un día antes de hoy)

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('commentDialog') commentDialog!: ComponentType<unknown>;
  @ViewChild('confirmDelete') confirmDelete!: SwalComponent;
  @ViewChild('errorDelete') errorDelete!: SwalComponent;
  @ViewChild('commentError') commentError!: SwalComponent;
  @ViewChild('successDelete') successDelete!: SwalComponent;
  @ViewChild('successReassign') successReassign!: SwalComponent;
  @ViewChild('errorReassign') errorReassign!: SwalComponent;

  get visibleColumns() {
    const validUser = this.userRole
      ? USERS_ACTIONS_ENABLED.includes(this.userRole)
      : false;

    const columnsFiltered = this.columns.filter((column) => {
      if (this.urlTable !== environment.active) {
        return column.visible && column.property !== 'actions';
      }
      return column.visible && (column.property !== 'actions' || validUser);
    });

    return columnsFiltered.map((column) => column.property);
  }

  /* ============== CONSTRUCTOR ============== */
  constructor(
    private fBuilder: FormBuilder,
    private dialog: MatDialog,
    private proceduresService: ProceduresService,
    private readonly layoutService: VexLayoutService,
    private dateAdapter: DateAdapter<Date>,
    private alertSnakbar: MatSnackBar,
    private authService: AuthService
  ) {
    this.dateAdapter.setLocale('es-CO');
  }

  /* ============== METHODS ============== */
  /* ------- Meth. Lifecycle Hooks ------- */
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    // this.searchCtrl.valueChanges
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((value) => this.onFilterChange(value));

    // this.beginAt = new Date();
    // this.getDataFromProceduresService();
    this.initForm();
    this.executionCodeValidate();
    this.individualNumberPartValid();

    this.maxStartDate = this.getOneDayBefore(new Date());

    // Validacion de fechas
    this.beginAtgreaterThanDate();
    this.beginAtEFormGreaterThanDate();
    this.defaultTableData();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['urlTable']) {
      this.urlTable = changes['urlTable'].currentValue;
    }
  }

  getOneDayBefore(date: Date): Date {
    const result = new Date(date);
    result.setDate(result.getDate() - 1);
    return result;
  }

  // Método para generar una fecha un mes atrás a partir de una fecha actual proporcionada
  getOneMonthAgo(date: Date): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() - 1);
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
      ])
    });
    this.beginAtForm?.setValue(this.getOneMonthAgo(new Date()));
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
    return TABLE_COLUMN_PROPERTIES;
  }

  get actions() {
    return [
      {
        label: 'Reasignar',
        icon: 'mat:swap_horiz',
        action: (row: ProceduresCollection) =>
          this.actionButtons('reassign', row)
      },
      {
        label: 'Anular',
        icon: 'mat:block',
        action: (row: ProceduresCollection) => this.actionButtons('cancel', row)
      }
      // {
      //   label: 'Reclasificar',
      //   icon: 'mat:delete',
      //   action: (row: ProceduresCollection) =>
      //     this.actionButtons('reclassify', row)
      // },
      // {
      //   label: 'Mecanismo jurídico',
      //   icon: 'mat:delete',
      //   action: (row: ProceduresCollection) =>
      //     this.actionButtons('mecanism', row)
      // }
    ];
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
    if (this.urlView != '') {
      this.dialog.open(DocumentViewerWorkHistoricalComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: { url: this.urlView }
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
    this.executionCodeForm?.setValue(0);

    this.individualNumberPartForm?.setValue('');
    const formValue: PageProceduresData = {
      page: this.page,
      size: this.pageSize,
      beginAt: this.formatDate(this.getOneMonthAgo(new Date())),
      beginAtE: this.formatDate(new Date()),
      executionCode: '0',
      individualNumber: ''
    };
    // this.objectParameters();
    this.getDataFromProceduresService(formValue);
  }

  onSearch(): void {
    const data = this.objectParameters();
    this.getDataFromProceduresService(data);
  }

  /* ------- Meth. Common ------- */
  objectParameters(): PageProceduresData {
    const formValue: PageProceduresData = {
      page: this.page,
      size: this.pageSize,
      beginAt: this.beginAtForm?.value
        ? this.formatDate(this.beginAtForm.value)
        : this.formatDate(this.getOneMonthAgo(new Date())),
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

    const day = this.padZero(date.getDate());
    const month = this.padZero(date.getMonth() + 1);
    const year = date.getFullYear();

    return `${day}/${month}/${year}`;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  /* ------- Meth. Modal load file ------- */

  /* ------- Meth. Services ------- */
  getDataFromProceduresService(data: PageProceduresData) {
    this.proceduresService
      .getFilterTableEjecutionService(data, this.urlTable || '')
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
            name: row.process?.name,
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

  actionButtons(id: string, row: ProceduresCollection): void {
    switch (id) {
      case 'reassign':
        this.reassignProcedure(row);
        break;
      case 'cancel':
        this.addComment(row);
        break;
      case 'reclassify':
        this.reclassifyProcedure(row);
        break;
      case 'mecanism':
        this.mecanismProcedure(row);
        break;
    }
  }

  mecanismProcedure(row: ProceduresCollection) {
  }

  reclassifyProcedure(row: ProceduresCollection) {
  }

  addComment(row: ProceduresCollection) {
    this.confirmDelete.fire().then((result) => {
      if (result.isConfirmed) {
        this.dialog
          .open(this.commentDialog, {
            ...MODAL_SMALL
          })
          .afterClosed()
          .subscribe((response: boolean) => {
            if (response) {
              if (!this.comment) return this.commentError.fire();
              this.proceduresService
                .commentProcedure(row.executionId!, this.comment)
                .subscribe({
                  next: () => {
                    this.cancelProcedure(row.executionId!);
                  },
                  error: (error: HttpErrorResponse) => {
                    this.errorDelete.fire();
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
        this.successDelete.fire();
      },
      error: (error: HttpErrorResponse) => {
        this.errorDelete.fire();
        throw error.message;
      }
    });
  }

  reassignProcedure(row: ProceduresCollection) {
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
            this.successReassign.fire();
            return;
          }

          if (response === 'error') {
            this.errorReassign.fire();
            return;
          }
        }
      });
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
