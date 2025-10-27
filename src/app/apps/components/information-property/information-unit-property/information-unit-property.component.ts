import { AfterViewInit, Component, DestroyRef, forwardRef, inject, input, Input, OnInit, output, ViewChild } from '@angular/core';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { FormsModule, NG_VALUE_ACCESSOR, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, PercentPipe } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { SearchData } from '@shared/interfaces';
import { InformationPegeable } from '@shared/interfaces';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import {
  LIST_SCHEMAS_CONTROL_CHANGES,
  LIST_SCHEMAS_CONTROL_MAIN,
  MODAL_LARGE,
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE_SORT,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL
} from '@shared/constants';
import { ContentInfoSchema } from '@shared/models';
import { environment } from 'src/environments/environments';
import {
  LayoutCardCadastralInformationPropertyComponentComponent
} from '@shared/components';
import { TypeInformation } from '@shared/interfaces';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  HeaderCadastralInformationPropertyComponent
} from '@shared/components';
import {
  UnitPropertyInformationService
} from '@shared/services';
import { PageSearchData } from '@shared/interfaces';
import {
  TABLE_COLUMN_UNITS_TABLE_COLUMNS
} from '../../../constants/information-property/modification-property-units.constants';
import { BaUnitHeadPercentage } from '@shared/interfaces';

@Component({
  selector: 'vex-information-unit-property',
  templateUrl: './information-unit-property.component.html',
  styleUrls: ['./information-unit-property.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    ReactiveFormsModule,
    // Vex
    // Material
    MatAutocompleteModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCardModule,
    MatCheckboxModule,
    MatDialogModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatOptionModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    // Custom
    HeaderCadastralInformationPropertyComponent,
    PercentPipe
  ],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => InformationUnitPropertyComponent),
      multi: true
    }
  ],
})
export class InformationUnitPropertyComponent implements OnInit, AfterViewInit {

  dataSource!: MatTableDataSource<BaUnitHeadPercentage>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  contentInformation!: InformationPegeable;
  searchData!: SearchData;
  // Input zone.js
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;

  // Input signals
  expandedComponent = input.required<boolean>();

  // Output signals
  emitExpandedComponent = output<number>();

  page: number = PAGE;
  pageSize: number = PAGE_SIZE_SORT;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  totalElements = 0;
  columns: TableColumn<BaUnitHeadPercentage>[] = TABLE_COLUMN_UNITS_TABLE_COLUMNS;

  @ViewChild(MatPaginator, { read: true }) paginatorUnitProperty?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private unitPropertyInformationService: UnitPropertyInformationService
  ) {
    this.destroyRef.onDestroy(() => console.log('destroyed'));
  }

  ngOnInit(): void {
    if (this.baunitId == null) {
      return;
    }

    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
    this.dataSource = new MatTableDataSource();
  }

  ngAfterViewInit(): void {
    if (this.paginatorUnitProperty) {
      this.dataSource.paginator = this.paginatorUnitProperty;
    }
    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  isExpandPanel(): void {
    this.emitExpandedComponent.emit(1);
    this.searchUnitPropertyInformationTemp();
  }

  searchUnitPropertyInformationTemp(): void {
    if (!this.baunitId) {
      return;
    }
    const page = new PageSearchData(this.page, this.pageSize, this.executionId);
    this.unitPropertyInformationService.getListPropertyUnitsByBaUnitIdV2(
      page, this.executionId, this.baunitId).subscribe({
      error: () => this.captureInformationSubscribeError(),
      next: (result: InformationPegeable) => this.captureInformationSubscribe(result)
    });
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformation = result;
    this.captureInformationCadastralData();
  }

  captureInformationCadastralData(): void {
    let data: BaUnitHeadPercentage[];
    if (this.contentInformation?.content != null) {
      data = this.contentInformation.content;
      data = data.map((row: BaUnitHeadPercentage) => new BaUnitHeadPercentage(row));
      this.dataSource.data = data;
    }

    if (this.contentInformation == null) {
      this.page = PAGE;
      return;
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

  openCadastralInformationProperty(data: BaUnitHeadPercentage): void {
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: new ContentInfoSchema(
          data.baunitHead?.baunitIdE, data.baunitHead,
          this.executionId,
          this.viewSchemas(),
          TYPE_INFORMATION_VISUAL
        )
      })
      .afterClosed();
  }

  viewSchemas() {
    return this.schema === `${environment.schemas.main}` ? LIST_SCHEMAS_CONTROL_MAIN : LIST_SCHEMAS_CONTROL_CHANGES;
  }

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }



  captureInformationSubscribeError(): void {
    this.contentInformation = new InformationPegeable();
    this.dataSource.data = [];
  }

  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;
    this.searchUnitPropertyInformationTemp();
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

}
