import {
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import { CommonModule, NgClass, NgIf } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Observable } from 'rxjs';

// recursos de vex
// recursos de angular material
// recursos de archivos locales
import { contentInfoAttachment } from '@shared/interfaces';
import { contentInfoProcedures } from '@shared/interfaces';
import {
  MY_DATE_FORMATS,
  // PAGE,
  // PAGE_SIZE,
  // PAGE_SIZE_OPTION,
  TABLE_COLUMN_PROPERTIES
} from '../../../../constants/general/procedures.constant';
import { ProceduresCollection } from '@shared/interfaces';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { ProceduresService } from '@shared/services';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { InformationPegeable } from '@shared/interfaces';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { TaskResponseModel } from '@shared/interfaces';
import { MatDialog } from '@angular/material/dialog';
import { DetailInformationTasksComponent } from 'src/app/pages/pages/my-work/tasks/components/detail-information-tasks/detail-information-tasks.component';
import { MODAL_SMALL, PAGE, PAGE_SIZE, PAGE_SIZE_OPTION } from '@shared/constants';

@Component({
  selector: 'vex-table-execution',
  standalone: true,
  templateUrl: './table-work-execution.component.html',
  styleUrl: './table-work-execution.component.scss',
  animations: [fadeInUp400ms, stagger40ms],
  providers: [{ provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS }],
  imports: [
    VexPageLayoutComponent,
    MatTableModule,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    CommonModule,
    FormsModule,
    MatDatepickerModule,
    NgClass,
    NgIf,
    ReactiveFormsModule
  ]
})
export class TableWorkExecutionComponent implements OnInit {
  /* ============== ATRIBUTES ============== */
  dataSource!: MatTableDataSource<ProceduresCollection>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  layoutCtrl = new UntypedFormControl('boxed');
  contentInformations!: InformationPegeable;
  private fBuilder = inject(FormBuilder);
  informationAddressForm!: FormGroup;
  seeInfo = false;
  textInfo =
    'Prueba de texto, lorem,Prueba de texto, lorem,Prueba de texto, lorem,Prueba de texto, lorem';
  public procedureDetail: TaskResponseModel = new TaskResponseModel();

  @Input()
  page: number = PAGE;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  totalElements = 0;
  columns: TableColumn<contentInfoProcedures>[] = TABLE_COLUMN_PROPERTIES;

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  /* ============== CONSTRUCTOR ============== */
  constructor(
    private dialog: MatDialog,
    private proceduresService: ProceduresService,
    private readonly layoutService: VexLayoutService,
    private dateAdapter: DateAdapter<Date>,
  ) {
    this.dateAdapter.setLocale('es-CO');
  }

  /* ============== METHODS ============== */
  /* ------- Meth. Lifecycle Hooks ------- */
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
  }

  /* ------- Meth. HTML ------- */
  toggleColumnVisibility(
    column: TableColumn<contentInfoAttachment>,
    event: Event
  ) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  refreshInformationpaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
  }

  onSearch(): void {
    // this.getDataFromProceduresService();
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  private padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }

  captureInformationSubscribe(data: InformationPegeable) {
    this.contentInformations = data;
    this.captureInformationProceduresData();
  }

  public informationDetail(value: ProceduresCollection) {
    this.proceduresService
      .viewDetailIdProcedures(+value.executionCode!)
      .subscribe((result) => {
        this.procedureDetail = result;
        this.seeTaskProperty(this.procedureDetail, +value.executionCode!);
      });
  }

  seeTaskProperty(value: TaskResponseModel, taskId: number): void {
    this.dialog.open(DetailInformationTasksComponent, {
      ...MODAL_SMALL,
      data: { taskId: taskId, value }
    });
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

  get beginAtForm() {
    return this.informationAddressForm.get('beginAtForm');
  }
  get beginAtEForm() {
    return this.informationAddressForm.get('beginAtEForm');
  }
  get executionCodeForm() {
    return this.informationAddressForm.get('executionCodeForm');
  }
  get individualNumberPartForm() {
    return this.informationAddressForm.get('individualNumberPartForm');
  }
}
