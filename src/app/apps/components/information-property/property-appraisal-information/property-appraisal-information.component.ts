import {
  AfterViewInit,
  Component,
  DestroyRef,
  forwardRef,
  inject,
  input,
  Input,
  OnInit,
  output,
  ViewChild
} from '@angular/core';
import { HeaderCadastralInformationPropertyComponent } from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  LIST_EXTRA_COLUMNS_APPRAISAL,
  LIST_GRID_APPRAISAL_1,
  LIST_GRID_APPRAISAL_2,
  LIST_GRID_APPRAISAL_3,
  MODAL_SMALL,
  MODAL_MEDIUM,
  MODAL_SMALL_XS,
  NAME_SELF_VALUATION_VALUE,
  PAGE,
  PAGE_OPTION_5_7_10,
  PAGE_SIZE_SORT,
  TABLE_COLUMN_PROPERTIES_APPRAISALS,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL
} from '../../../constants/general/constants';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CommonModule, DatePipe, NgClass } from '@angular/common';
import {
  FormsModule,
  NG_VALUE_ACCESSOR,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { environment } from '../../../../../environments/environments';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatDialog } from '@angular/material/dialog';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { InformationPropertyService } from '../../../services/territorial-organization/information-property.service';
import { InfoAppraisal } from '../../../interfaces/information-property/info-appraisal';
import { BaunitHead } from '../../../interfaces/information-property/baunit-head.model';
import { PageSearchData } from '../../../interfaces/general/page-search-data.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import { Observable } from 'rxjs';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRippleModule } from '@angular/material/core';
import { TypeInformation } from '../../../interfaces/general/content-info';
import { CurrencyFormatPipe } from 'src/app/apps/pipes/currencyFormat.pipe';
import { AutoAppraisalComponent } from './auto-appraisal/auto-appraisal.component';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { HistoricAppraisalComponent } from './historic-appraisal/historic-appraisal.component';
import { AppraisalDetailsComponent } from './appraisal-details/appraisal-details.component';

@Component({
  selector: 'vex-property-appraisal-information',
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
    CommonModule,
    HeaderCadastralInformationPropertyComponent,
    MatExpansionModule,
    MatButtonModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableModule,
    MatTooltipModule,
    ReactiveFormsModule,
    DatePipe,
    NgClass,
    MatMenuModule,
    MatCheckboxModule,
    FormsModule,
    MatRippleModule,
    CurrencyFormatPipe,
    SweetAlert2Module
  ],
  templateUrl: './property-appraisal-information.component.html',
  styleUrl: './property-appraisal-information.component.scss',
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => PropertyAppraisalInformationComponent),
      multi: true
    }
  ]
})
export class PropertyAppraisalInformationComponent
  implements OnInit, AfterViewInit
{
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformations!: InformationPegeable;

  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() editable?: boolean;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;

  // Input signals
  expandedComponent = input.required<boolean>();

  // Output signals
  emitExpandedComponent = output<number>();

  columns: TableColumn<InfoAppraisal>[] = TABLE_COLUMN_PROPERTIES_APPRAISALS;
  page: number = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE_SORT;
  pageSizeOptions: number[] = PAGE_OPTION_5_7_10;

  dataSource!: MatTableDataSource<InfoAppraisal>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('successAutoAppraisal') successAutoAppraisal!: SwalComponent;
  @ViewChild('errorAutoAppraisal') errorAutoAppraisal!: SwalComponent;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private informationPropertyService: InformationPropertyService
  ) {}

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    if (this.baunitId == null) {
      return;
    }
    if (
      this.typeInformation &&
      this.typeInformation === TYPE_INFORMATION_VISUAL
    ) {
      this.pageSize = PAGE_SIZE_SORT;
    }
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  get visibleColumns() {
    const visibleColumns = this.columns
      .filter((column) => {
        return column.visible;
      })
      .map((column) => column.property);

    return ['viewDetail', ...visibleColumns];
  }

  get visibleColumnsSecondsRow() {
    let listadoSecondRow: string[] = LIST_EXTRA_COLUMNS_APPRAISAL;
    const listColumnVisible: string[] = this.visibleColumns;
    if (!listColumnVisible.includes(NAME_SELF_VALUATION_VALUE)) {
      listadoSecondRow = listadoSecondRow.filter(
        (e) => e !== 'header-row-quartet-group'
      );
    }
    if (
      !this.validatePropertyInList(listColumnVisible, LIST_GRID_APPRAISAL_3)
    ) {
      listadoSecondRow = listadoSecondRow.filter(
        (e) => e !== 'header-row-third-group'
      );
    }
    if (
      !this.validatePropertyInList(listColumnVisible, LIST_GRID_APPRAISAL_2)
    ) {
      listadoSecondRow = listadoSecondRow.filter(
        (e) => e !== 'header-row-second-group'
      );
    }
    if (
      !this.validatePropertyInList(listColumnVisible, LIST_GRID_APPRAISAL_1)
    ) {
      listadoSecondRow = listadoSecondRow.filter(
        (e) => e !== 'header-row-first-group'
      );
    }
    return listadoSecondRow;
  }

  private validatePropertyInList(
    listFirst: string[],
    listSecond: string[]
  ): boolean {
    let showProperty = false;
    listFirst.forEach((e) => {
      if (listSecond.includes(e)) {
        showProperty = true;
      }
    });
    return showProperty;
  }

  isExpandPanel(): void {
    this.emitExpandedComponent.emit(8);
    this.searchInformationsAppraisalsProperty();
  }

  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

    const validate: boolean = this.searchInformationsAppraisalsProperty();
    if (!validate) {
      throw new Error('No fue posible actualizar los datos de la tabla');
    }
  }

  searchInformationsAppraisalsProperty(): boolean {
    if (!this.schema || !this.baunitId) {
      return false;
    }
    this.informationPropertyService
      .getBasicInformationAppraisalsProperty(
        this.generateObjectPageSearchData(this.baunitId),
        this.schema,
        this.executionId
      )
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: InformationPegeable) =>
          this.captureInformationSubscribe(result)
      });
    return true;
  }

  captureInformationSubscribeError(): void {
    this.contentInformations = new InformationPegeable();
    this.dataSource.data = [];
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformations = result;
    this.captureInformationAppraisalData();
  }

  captureInformationAppraisalData(): void {
    let data: InfoAppraisal[];
    if (this.contentInformations && this.contentInformations.content) {
      data = this.contentInformations.content;
      data = data.map((row: InfoAppraisal) => new InfoAppraisal(row));
      this.dataSource.data = data;
    }

    if (this.contentInformations === null) {
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

  toggleColumnVisibility(column: TableColumn<BaunitHead>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  deleteInformations(customer: InfoAppraisal) {
    console.log(customer);
  }

  autoAppraisal() {
    this.dialog
      .open(AutoAppraisalComponent, {
        ...MODAL_SMALL_XS,
        data: {
          executionId: this.executionId,
          baunitId: this.baunitId
        }
      })
      .afterClosed()
      .subscribe((result: boolean | undefined) => {
        if (result === true) {
          this.successAutoAppraisal.fire();
          this.searchInformationsAppraisalsProperty();
        } else if (result === false) {
          this.errorAutoAppraisal.fire();
        }
      });
  }

  historyAppraisal() {
    this.dialog.open(HistoricAppraisalComponent, {
      ...MODAL_MEDIUM,
      data: {
        baunitId: this.baunitId,
        schema: this.schema,
        executionId: this.executionId
      }
    });
  }

  private generateObjectPageSearchData(baunitId: string): PageSearchData {
    return new PageSearchData(this.page, this.pageSize, baunitId);
  }

  viewDetails(row: InfoAppraisal) {
    this.dialog.open(AppraisalDetailsComponent, {
      ...MODAL_SMALL,
      data: row
    });
  }
}
