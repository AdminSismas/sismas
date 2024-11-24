import { AfterViewInit, Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import {
  HeaderCadastralInformationPropertyComponent
} from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { MatExpansionModule } from '@angular/material/expansion';
import {
  FORMAT_CURRENCY_COP,
  FORMAT_CURRENCY_SIMBOL,
  LIST_EXTRA_COLUMNS_APPRAISAL,
  LIST_GRID_APPRAISAL_1,
  LIST_GRID_APPRAISAL_2,
  LIST_GRID_APPRAISAL_3,
  NAME_NO_DISPONIBLE,
  NAME_SELFVALUATIONVALUE,
  PAGE,
  PAGE_SIZE,
  PAGE_SIZE_OPTION_ADDRESS,
  PAGE_SIZE_SORT,
  TABLE_COLUMN_PROPERTIES_APPRAISALS, TYPEINFORMATION_EDITION, TYPEINFORMATION_VISUAL
} from '../../../constants/constant';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTooltipModule } from '@angular/material/tooltip';
import { CurrencyPipe, DatePipe, NgClass, NgForOf, NgIf } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { environment } from '../../../../../environments/environments';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatDialog } from '@angular/material/dialog';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { InformationPropertyService } from '../../../services/territorial-organization/information-property.service';
import { InfoAppraisal } from '../../../interfaces/information-property/info-appraisal';
import { BaunitHead } from '../../../interfaces/information-property/baunit-head.model';
import { PageSearchData } from '../../../interfaces/page-search-data.model';
import { MatMenuModule } from '@angular/material/menu';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { InformationPegeable } from '../../../interfaces/information-pegeable.model';
import { Observable } from 'rxjs';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatRippleModule } from '@angular/material/core';
import { TypeInformation } from '../../../interfaces/content-info';

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
    NgForOf,
    NgIf,
    ReactiveFormsModule,
    DatePipe,
    NgClass,
    MatMenuModule,
    MatCheckboxModule,
    FormsModule,
    CurrencyPipe,
    MatRippleModule
  ],
  templateUrl: './property-appraisal-information.component.html',
  styleUrl: './property-appraisal-information.component.scss'
})
export class PropertyAppraisalInformationComponent implements OnInit, AfterViewInit {

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformations!: InformationPegeable;

  @Input({ required: true }) id: string = '';
  @Input({ required: false }) public expandedComponent: boolean = false;
  @Input({ required: true }) schema: string = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPEINFORMATION_EDITION;

  columns: TableColumn<InfoAppraisal>[] = TABLE_COLUMN_PROPERTIES_APPRAISALS;
  page: number = PAGE;
  totalElements: number = 0;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION_ADDRESS;

  dataSource!: MatTableDataSource<InfoAppraisal>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private informationPropertyService: InformationPropertyService
  ) {
  }

  ngOnInit() {
    this.dataSource = new MatTableDataSource();
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + this.getRandomInt(10000) + this.schema + this.baunitId;
    if (this.typeInformation && this.typeInformation === TYPEINFORMATION_VISUAL) {
      this.pageSize = PAGE_SIZE_SORT;
      this.pageSizeOptions = PAGE_SIZE_OPTION_ADDRESS;
    }
    this.isExpandPanel(this.expandedComponent);
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
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  get visibleColumnsSecondsRow() {
    let listadoSecondRow: string[] = LIST_EXTRA_COLUMNS_APPRAISAL;
    const listColumnVisible: string[] = this.visibleColumns;
    if (!listColumnVisible.includes(NAME_SELFVALUATIONVALUE)) {
      listadoSecondRow = listadoSecondRow.filter(e => e !== 'header-row-quartet-group');
    }
    if (!this.validatePropertyInList(listColumnVisible, LIST_GRID_APPRAISAL_3)) {
      listadoSecondRow = listadoSecondRow.filter(e => e !== 'header-row-third-group');
    }
    if (!this.validatePropertyInList(listColumnVisible, LIST_GRID_APPRAISAL_2)) {
      listadoSecondRow = listadoSecondRow.filter(e => e !== 'header-row-second-group');
    }
    if (!this.validatePropertyInList(listColumnVisible, LIST_GRID_APPRAISAL_1)) {
      listadoSecondRow = listadoSecondRow.filter(e => e !== 'header-row-first-group');
    }
    return listadoSecondRow;
  }

  private validatePropertyInList(listFirst: string[], listSecond: string[]): boolean {
    let showProperty: boolean = false;
    listFirst.forEach(e => {
      if (listSecond.includes(e)) {
        showProperty = true;
      }
    });
    return showProperty;
  }

  deleteInformations(customer: any): void {
    console.log(customer);
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.searchInformationsAppraisalsProperty();
    }
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
    this.informationPropertyService.getBasicInformationsAppraisalsProperty(
      this.generateObjectPageSearchData(this.baunitId), this.schema, this.executionId)
      .subscribe({
        error: (err: any) => this.captureInformationSubscribeError(err),
        next: (result: InformationPegeable) => this.captureInformationSubscribe(result)
      });
    return true;
  }

  captureInformationSubscribeError(err: any): void {
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

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  private generateObjectPageSearchData(baunitId: string): PageSearchData {
    return new PageSearchData(this.page, this.pageSize, baunitId);
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  protected readonly LIST_EXTRA_COLUMNS_APPRAISAL = LIST_EXTRA_COLUMNS_APPRAISAL;
  protected readonly FORMAT_CURRENCY_COP = FORMAT_CURRENCY_COP;
  protected readonly FORMAT_CURRENCY_SIMBOL = FORMAT_CURRENCY_SIMBOL;
  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
