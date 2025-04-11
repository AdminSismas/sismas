// ANGULAR IMPORTS
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { Component, DestroyRef, inject, Input, OnInit } from '@angular/core';
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
  LIST_SCHEMAS_CONTROL_HISTORY, LIST_SCHEMAS_CONTROL_TEMP,
  MODAL_LARGE, MODAL_MIN_MEDIUM_ALL,
  MODAL_SMALL, MODAL_SMALL_XS,
  PAGE,
  PAGE_OPTION_10_20_50_100, PAGE_OPTION_5_7_10, PAGE_SIZE_SORT,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL
} from 'src/app/apps/constants/general/constants';
import { environment } from 'src/environments/environments';
import { PAGE_SIZE, TABLE_COLUMN_PROPERTIES_HISTORY } from 'src/app/apps/constants/general/procedures.constant';

// COMPONENT IMPORTS
import {
  HeaderCadastralInformationPropertyComponent
} from '../header-cadastral-information-property/header-cadastral-information-property.component';

// INTERFACES IMPORTS
import { TypeInformation } from 'src/app/apps/interfaces/general/content-info';
import { ProceduresCollection } from 'src/app/apps/interfaces/tables/procedures-progress.model';
import { InformationPegeable } from 'src/app/apps/interfaces/general/information-pegeable.model';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { PageProceduresData } from 'src/app/apps/interfaces/general/page-procedures-data.model';
import { ProceduresService } from 'src/app/apps/services/general/procedures.service';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { contentInfoProcedures } from 'src/app/apps/interfaces/general/content-info-procedures.model';
import { MatSelectModule } from '@angular/material/select';
import { MatDialog } from '@angular/material/dialog';
import {
  DetailInformationTasksComponent
} from 'src/app/pages/pages/my-work/tasks/components/detail-information-tasks/detail-information-tasks.component';
import { TaskResponseModel } from 'src/app/apps/interfaces/bpm/task-response.model';
import {
  LayoutCardCadastralInformationPropertyComponentComponent
} from '../layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import { ContentInfoSchema } from '../../../interfaces/general/content-info-schema';
import { getRandomInt } from 'src/app/apps/utils/general';
import { AlfaMainService } from '../../../services/bpm/core/alfa-main.service';
import { BaunitHead } from '../../../interfaces/information-property/baunit-head.model';
import Swal from 'sweetalert2';
import { BpmCoreService } from '../../../services/bpm/bpm-core.service';
import { DifferenceChanges } from '../../../interfaces/bpm/difference-changes';
import {
  ViewChangesBpmOperationComponent
} from '../../bpm/view-changes-bpm-operation/view-changes-bpm-operation.component';


@Component({
  selector: 'vex-historical-active-procedures-property',
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
  templateUrl: './historical-active-procedures.component.html',
  styleUrl: './historical-active-procedures.component.scss'
})
export class HistoricalActiveProceduresPropertyComponent implements OnInit {

  @Input({ required: true }) id = '';
  @Input({ required: true }) isHistoricalComponent!: boolean;
  @Input({ required: true }) public expandedComponent = true;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null = null;
  @Input() editable?: boolean;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);
  private readonly layoutService: VexLayoutService = inject(VexLayoutService);
  private proceduresService: ProceduresService = inject(ProceduresService);
  private alfaMainService: AlfaMainService = inject(AlfaMainService);
  private dialog: MatDialog = inject(MatDialog);
  private bpmCoreService: BpmCoreService = inject(BpmCoreService);

  dataSource!: MatTableDataSource<ProceduresCollection>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  layoutCtrl = new UntypedFormControl('boxed');
  contentInformations!: InformationPegeable;

  page: number = PAGE;
  pageSize: number = PAGE_SIZE_SORT;
  pageSizeOptions: number[] = PAGE_OPTION_5_7_10;
  totalElements = 0;
  columns: TableColumn<contentInfoProcedures>[] = TABLE_COLUMN_PROPERTIES_HISTORY;

  constructor() {
  }

  ngOnInit(): void {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + getRandomInt(10057) + this.schema + (this.isHistoricalComponent ? 'historical' : 'active');
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

  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    const data = this.objectParameters();
    if (this.isHistoricalComponent) {
      this.getDataFromProceduresService(data);
    } else {
      this.getDataFromProceduresActiveService(data);
    }
  }

  /* ------- Meth. Common ------- */
  objectParameters(): PageProceduresData {
    return new PageProceduresData(
      this.page,
      this.pageSize,
      this.formatDate(this.getOneMonthAgo(new Date())),
      this.formatDate(new Date()),
      '0', ''
    );
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
      if (this.isHistoricalComponent) {
        this.getDataFromProceduresService(formValue);
      } else {
        this.getDataFromProceduresActiveService(formValue);
      }
    }
  }

  /* ------- Meth. Services ------- */
  getDataFromProceduresService(data: PageProceduresData) {
    this.proceduresService.getBaUnitHistoricProcedures(this.baunitId!, data)
      .subscribe({
        next: (result) => this.captureInformationSubscribe(result),
        error: () => this.swalErrorCaptureInformationProcedures()
      });
  }

  getDataFromProceduresActiveService(data: PageProceduresData) {
    this.proceduresService.getBaUnitActiveProcedures(this.baunitId!, data)
      .subscribe({
        next: (result) => this.captureInformationSubscribe(result),
        error: () => this.swalErrorCaptureInformationProcedures()
      });
  }

  captureInformationSubscribe(data: InformationPegeable) {
    this.contentInformations = data;
    this.captureInformationProceduresData();
  }

  captureInformationProceduresData() {
    let executeIdIntoExecuteId: boolean = false;
    let data: contentInfoProcedures[];

    if (this.contentInformations == null || (this.contentInformations.content == null || this.contentInformations.content.length <= 0)) {
      this.page = PAGE;
      return;
    }

    if (!this.isHistoricalComponent && this.executionId) {
      data = this.contentInformations.content.filter((pr: ProceduresCollection) => pr.executionId?.toString() !== this.executionId);
      if (data == null || data.length === 0) {
        this.page = PAGE;
        return;
      }
      executeIdIntoExecuteId = data.length !== this.contentInformations.content.length;
    }

    data = this.contentInformations.content.map(
      (row: ProceduresCollection) =>
        new contentInfoProcedures({
          ...row,
          name: row.process?.name,
          processName: row.process?.name
        })
    );
    this.dataSource.data = data;
    if (this.contentInformations.totalElements) {
      this.totalElements = executeIdIntoExecuteId ? (this.contentInformations.totalElements - 1) : this.contentInformations.totalElements;
    }

    if (this.contentInformations.pageable == null) {
      this.page = PAGE;
      return;
    }

    if (this.contentInformations.pageable.pageNumber != null) {
      this.page = this.contentInformations.pageable.pageNumber;
    }
  }

  openCadastralInformationProperty(data: contentInfoProcedures): void {
    if (this.baunitId && data && data.executionId != null) {
      const executionId: string = data.executionId.toString();
      if (this.isHistoricalComponent) {
        this.openInformationHistoryProcedures(executionId, this.baunitId);
      } else {
        this.openInformationActiveProcedures(executionId, this.baunitId);
      }
    }
  }

  openInformationHistoryProcedures(executionId: string, baunitId: string) {
    if (!baunitId) {
      return;
    }
    this.alfaMainService.getBaUnitHeadHistory(executionId, baunitId)
      .subscribe({
        next: (result: BaunitHead) => {
          if (result === null) {
            this.swalErrorInformationProceduresNotFound();
            return;
          }
          this.dialog.open(LayoutCardCadastralInformationPropertyComponentComponent, {
            ...MODAL_LARGE,
            disableClose: true,
            data: new ContentInfoSchema(
              this.baunitId, result,
              executionId,
              LIST_SCHEMAS_CONTROL_HISTORY,
              TYPE_INFORMATION_VISUAL,
              '',
              []
            )
          }).afterClosed();
        },
        error: () => this.swalErrorBaUnitHead(executionId)
      });
  }

  openInformationActiveProcedures(executionId: string, baunitId: string) {
    if (!baunitId) {
      return;
    }
    this.alfaMainService.getBaUnitHeadTemporal(executionId, baunitId)
      .subscribe({
        next: (result: BaunitHead) => {
          if (result === null) {
            this.swalErrorInformationProceduresNotFound();
            return;
          }
          this.dialog.open(LayoutCardCadastralInformationPropertyComponentComponent, {
            ...MODAL_LARGE,
            disableClose: true,
            data: new ContentInfoSchema(
              this.baunitId, result,
              executionId,
              LIST_SCHEMAS_CONTROL_TEMP,
              TYPE_INFORMATION_VISUAL,
              '',
              []
            )
          }).afterClosed();
        },
        error: () => this.swalErrorBaUnitHead(executionId)
      });
  }

  openCompareHistoryWithMain(data: contentInfoProcedures) {
    if (this.baunitId && data && data.executionId != null) {
      const executionId: string = data.executionId.toString();
      this.bpmCoreService.viewChangesBpmOperationHistory(executionId, this.baunitId)
        .subscribe({
          error: () => this.messageChangesNoAvailable(),
          next: (result: DifferenceChanges[]) => {
            if (!result || result.length <= 0) {
              this.messageChangesNoAvailable();
              return;
            }
            const data: DifferenceChanges[] = result.map((row: DifferenceChanges) =>
              new DifferenceChanges(row, executionId, this.baunitId)
            );
            this.dialog
              .open(ViewChangesBpmOperationComponent, {
                ...MODAL_MIN_MEDIUM_ALL,
                disableClose: true,
                data: data
              })
              .afterClosed();
          },
        });
    }
  }

  messageChangesNoAvailable() {
    Swal.fire({
      text: 'Cambios realizados en el control de cambios no disponibles, consulte al administrador.',
      icon: 'error',
      showConfirmButton: false,
      timer: 10000
    }).then((result) => {
    });
  }

  swalErrorBaUnitHead(executionId: string) {
    Swal.fire({
      title: '¡Error!',
      text: 'Hubo un error, verifique la información de la unidad predial: ' + this.baunitId + ' y la version: ' + executionId,
      icon: 'error',
      showConfirmButton: false,
      timer: 3000
    }).then((result) => {
    });
  }

  swalErrorCaptureInformationProcedures() {
    Swal.fire({
      title: '¡Error!',
      text: 'Hubo un error, verifique la información de los filtros',
      icon: 'error',
      showConfirmButton: false,
      timer: 3000
    }).then((result) => {
    });
  }

  swalErrorInformationProceduresNotFound() {
    Swal.fire({
      title: '¡Error!',
      text: 'Hubo un error al obtener la informacion, actualmente no se encuentra disponible',
      icon: 'error',
      showConfirmButton: false,
      timer: 3000
    }).then((result) => {
    });
  }

}
