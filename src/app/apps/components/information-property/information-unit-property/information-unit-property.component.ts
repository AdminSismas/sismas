import { AfterViewInit, Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { BaunitHead } from 'src/app/apps/interfaces/information-property/baunit-head.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { SelectionModel } from '@angular/cdk/collections';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { NgClass, NgFor, NgIf } from '@angular/common';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { SearchData } from '../../../interfaces/general/search-data.model';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import {
  LIST_SCHEMAS_CONTROL_CHANGES,
  LIST_SCHEMAS_CONTROL_MAIN,
  MODAL_LARGE,
  PAGE, PAGE_OPTION_5_7_10,
  PAGE_SIZE_OPTION, PAGE_SIZE_SORT,
  PAGE_SIZE_TABLE_CADASTRAL,
  TABLE_COLUMN_INFORMATION_PROPERTIES,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL
} from '../../../constants/general/constants';
import { ContentInfoSchema } from '../../../interfaces/general/content-info-schema';
import { environment } from 'src/environments/environments';
import {
  LayoutCardCadastralInformationPropertyComponentComponent
} from '../layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import { TypeInformation } from '../../../interfaces/general/content-info';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import {
  HeaderCadastralInformationPropertyComponent
} from '../header-cadastral-information-property/header-cadastral-information-property.component';
import {
  UnitPropertyInformationService
} from '../../../services/territorial-organization/baunit-children-information.service';
import { Baunit, BAunitLike } from 'src/app/apps/interfaces/information-property/baunit-npnlike';
import { getRandomInt } from '../../../utils/general';

@Component({
  selector: 'vex-information-unit-property',
  templateUrl: './information-unit-property.component.html',
  styleUrls: ['./information-unit-property.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
  standalone: true,
  imports: [
    FormsModule,
    NgClass,
    NgFor,
    NgIf,
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
    HeaderCadastralInformationPropertyComponent
  ]
})
export class InformationUnitPropertyComponent implements OnInit, AfterViewInit {

  dataSource!: MatTableDataSource<BaunitHead>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  contentInformation!: InformationPegeable;
  searchData!: SearchData;
  baunitData!: Baunit;

  @Input({ required: true }) id = '';
  @Input({ required: true }) expandedComponent = false;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;

  page: number = PAGE;
  pageSize: number = PAGE_SIZE_SORT;
  pageSizeOptions: number[] = PAGE_OPTION_5_7_10;
  totalElements = 0;
  columns: TableColumn<BaunitHead>[] = TABLE_COLUMN_INFORMATION_PROPERTIES;

  @ViewChild(MatPaginator, { read: true }) paginatorUnitProperty?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private dialog: MatDialog,
    private unitPropertyInformationService: UnitPropertyInformationService
  ) {
    this.destroyRef.onDestroy(() => {
    });
  }

  ngOnInit(): void {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + getRandomInt(10000) + this.schema + this.baunitId;

    this.isExpandPanel(this.expandedComponent);

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


  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.searchBaUnitIdInformation();
    }
  }

  searchBaUnitIdInformation(): void {
    if (!this.schema || !this.baunitId) {
      return;
    }
    this.unitPropertyInformationService.getBaunitInformation(this.baunitId).subscribe({
      error: () => this.captureInformationSubscribeError(),
      next: (result: Baunit) => {
        this.baunitData = result;
        this.searchUnitPropertyInformation(result);
      }
    });
  }

  searchUnitPropertyInformation(result: Baunit): void {
    if (!this.schema || !this.baunitId || !result) {
      return;
    }
    this.unitPropertyInformationService.getUnitPropertyInformation(result.cadastralNumber, this.page, this.pageSize)
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result2: BAunitLike) =>
          this.captureInformationSubscribe(result2)
      });
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformation = result;
    this.captureInformationCadastralData();
  }

  captureInformationCadastralData(): void {
    let data: BaunitHead[];
    if (this.contentInformation?.content != null) {
      data = this.contentInformation.content;
      data = data.map((row: BaunitHead) => new BaunitHead(row));
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

  openCadastralInformationProperty(data: BaunitHead): void {
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: new ContentInfoSchema(
          data.baunitIdE, data,
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

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
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
    this.searchUnitPropertyInformation(this.baunitData);
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

}
