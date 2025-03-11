// ANGULAR IMPORTS
import { CdkAccordionModule } from '@angular/cdk/accordion';
import {
  Component,
  DestroyRef,
  EventEmitter,
  inject,
  Input,
  OnInit,
  Output
} from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';

// ANGULAR MATERIAL IMPORTS
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

// VEX IMPORTS
import { VexLayoutService } from '@vex/services/vex-layout.service';

// CONSTANTS AND ENVIRONMENT IMPORTS
import {
  MODAL_SMALL,
  PAGE,
  PAGE_OPTION__10_20_50_100,
  TYPE_INFORMATION_EDITION
} from 'src/app/apps/constants/general/constant';
import { environment } from 'src/environments/environments';
import {
  PAGE_SIZE,
  TABLE_COLUMN_PROPERTIES_HISTORY
} from 'src/app/apps/constants/general/procedures.constant';

// COMPONENT IMPORTS
import { HeaderCadastralInformationPropertyComponent } from '../header-cadastral-information-property/header-cadastral-information-property.component';

// INTERFACES IMPORTS
import { TypeInformation } from 'src/app/apps/interfaces/general/content-info';
import { ProceduresCollection } from 'src/app/apps/interfaces/tables/procedures-progress.model';
import { InformationPegeable } from 'src/app/apps/interfaces/general/information-pegeable.model';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { PageProceduresData } from 'src/app/apps/interfaces/general/page-procedures-data.model';
import { ProceduresService } from 'src/app/apps/services/general/procedures.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { contentInfoProcedures } from 'src/app/apps/interfaces/general/content-info-procedures.model';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import { DetailInformationTasksComponent } from 'src/app/pages/pages/my-work/tasks/components/detail-information-tasks/detail-information-tasks.component';
import { TaskResponseModel } from 'src/app/apps/interfaces/bpm/task-response.model';

export interface HistoryListBasic {
  nameList: string;
  executionId: number;
  bpmProcessCategory: string;
  processName: string;
  lastupdated_at: string;
}

@Component({
  selector: 'vex-historical-procedures-property',
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
    MatExpansionModule,
    CdkAccordionModule,
    HeaderCadastralInformationPropertyComponent,

    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    CommonModule,
    MatDatepickerModule,
    NgFor,
    NgClass,
    NgIf,
    ReactiveFormsModule,
    MatSelectModule
  ],
  templateUrl: './historical-procedures.component.html',
  styleUrl: './historical-procedures.component.scss'
})
export class HistoricalProceduresPropertyComponent implements OnInit {
  @Input({ required: true }) id = '';
  @Input({ required: true }) public expandedComponent = true;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() editable?: boolean;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;
  @Output() showListHistory = new EventEmitter<HistoryListBasic[]>();

  dataSource!: MatTableDataSource<ProceduresCollection>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  layoutCtrl = new UntypedFormControl('boxed');
  contentInformations!: InformationPegeable;

  page: number = PAGE;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_OPTION__10_20_50_100;
  totalElements = 0;
  columns: TableColumn<contentInfoProcedures>[] =
    TABLE_COLUMN_PROPERTIES_HISTORY;
  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private dialog: MatDialog = inject(MatDialog);

  constructor(
    private readonly layoutService: VexLayoutService,
    private proceduresService: ProceduresService,
    private alertSnakbar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
    this.defaultTableData();
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.defaultTableData();
    }
  }

  public informationDetail(value: TaskResponseModel) {
    this.dialog.open(DetailInformationTasksComponent, {
      ...MODAL_SMALL,
      data: { taskId: +value.executionId!, value }
    });
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
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
    const data = this.objectParameters();
    this.getDataFromProceduresService(data);
  }

  /* ------- Meth. Common ------- */
  objectParameters(): PageProceduresData {
    const formValue: PageProceduresData = {
      page: this.page,
      size: this.pageSize,
      beginAt: this.formatDate(this.getOneMonthAgo(new Date())),
      beginAtE: this.formatDate(new Date()),
      executionCode: '0',
      individualNumber: ''
    };

    return formValue;
  }

  getOneMonthAgo(date: Date): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() - 1);
    return result;
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

  public defaultTableData() {
    const formValue: PageProceduresData = {
      page: this.page,
      size: this.pageSize,
      beginAt: '',
      beginAtE: '',
      executionCode: this.baunitId != null ? this.baunitId : '0',
      individualNumber: ''
    };
    if (this.baunitId != null) {
      this.getDataFromProceduresService(formValue);
    }
  }

  /* ------- Meth. Services ------- */
  getDataFromProceduresService(data: PageProceduresData) {
    this.proceduresService
      .getBaunitHistoricProcedures(this.baunitId!, data)
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
    this.proccessHistoryList(data);
  }

  proccessHistoryList(data: InformationPegeable): void {
    if (data?.content.length > 1) {
      const content = data.content as TaskResponseModel[];

      const listHistory: HistoryListBasic[] = content.map((row) => ({
        nameList:
          'Versión: ' +
          row.executionId! +
          ' - Radicado: ' +
          row.executionCode! +
          ' - ' +
          row.bpmProcessCategory! +
          ' - ' +
          row.processName! +
          ' - ' +
          this.transformDate(row.lastUpdateAt!),
        executionId: row.executionId!,
        bpmProcessCategory: row.bpmProcessCategory!,
        processName: row.processName!,
        lastupdated_at: this.transformDate(new Date(row.lastUpdateAt!))
      }));
      this.showListHistory.emit(listHistory);
    }
  }

  transformDate(date: Date | string): string {
    return this.proceduresService.formatDate(date);
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
}
