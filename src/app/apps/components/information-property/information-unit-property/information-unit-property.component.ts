import { AfterViewInit, Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
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
import { SearchData } from 'src/app/apps/interfaces/search-data.model';
import { InformationPegeable } from 'src/app/apps/interfaces/information-pegeable.model';
import { PageSearchData } from 'src/app/apps/interfaces/page-search-data.model';
import { Observable } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import {
  LIST_SCHEMAS_CONTROL_MAIN,
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE_TABLE_CADASTRAL,
  TABLE_COLUMN_PROPERTIES,
  TYPEINFORMATION_EDITION,
  TYPEINFORMATION_VISUAL,
} from 'src/app/apps/constants/constant';
import { ContentInfoSchema } from 'src/app/apps/interfaces/content-info-schema';
import { GeographicViewerComponent } from '../../geographic-viewer/geographic-viewer.component';
import { environment as envi, environment } from 'src/environments/environments';
import { SendInformationRegisterService } from 'src/app/apps/services/register-procedure/send-information-register.service';
import { ValidateInformationBaunitService } from 'src/app/apps/services/general/validate-information-baunit.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { LayoutCardCadastralInformationPropertyComponentComponent } from '../layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import { TypeInformation } from 'src/app/apps/interfaces/content-info';
import { MatAutocompleteModule } from '@angular/material/autocomplete';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatCardModule } from '@angular/material/card';
import { MatOptionModule } from '@angular/material/core';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { HeaderCadastralInformationPropertyComponent } from '../header-cadastral-information-property/header-cadastral-information-property.component';
import { UnitPropertyInformationService } from '../../../services/territorial-organization/baunit-children-information.service';
import { Baunit, BAunitLike } from 'src/app/apps/interfaces/information-property/baunit-npnlike';


@Component({
  selector: 'vex-information-unit-property',
  templateUrl: './information-unit-property.html',
  styleUrls: ['./information-unit-property.scss'],
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
    HeaderCadastralInformationPropertyComponent,
  ]
})
export class InformationUnitPropertyComponent implements OnInit, AfterViewInit {

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformation!: InformationPegeable;
  searchData!: SearchData;

  @Input({ required: true }) id = '';
  @Input({ required: true }) expandedComponent = false;
  @Input({ required: true }) schema = `${environment.schemas.main}`;
  @Input({ required: true }) baunitId: string | null | undefined = null;
  @Input() executionId: string | null | undefined = null;
  @Input() typeInformation: TypeInformation = TYPEINFORMATION_EDITION;

  @Input()
  columns: TableColumn<BaunitHead>[] = TABLE_COLUMN_PROPERTIES;
  page = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE_TABLE_CADASTRAL;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  dataSource!: MatTableDataSource<BaunitHead>;
  selection: SelectionModel<BaunitHead> = new SelectionModel<BaunitHead>(true, []);
  searchCtrl: UntypedFormControl = new UntypedFormControl();

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private readonly layoutService: VexLayoutService,
    private sendInformation: SendInformationRegisterService,
    private baunitService: ValidateInformationBaunitService,
    private unitPropertyInformationService: UnitPropertyInformationService
  ) {
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit(): void {
    if (this.id?.length <= 0 || this.baunitId == null) {
      return;
    }
    this.id = this.id + this.getRandomInt(10000) + this.schema + this.baunitId;
    if (
      this.typeInformation &&
      this.typeInformation === TYPEINFORMATION_VISUAL
    ) {
    }

    this.isExpandPanel(this.expandedComponent);
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    this.dataSource = new MatTableDataSource();
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  private getRandomInt(max: number): number {
    return Math.floor(Math.random() * max);
  }

  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
      this.searchUnitPropertyInformation();
    }
  }

  searchUnitPropertyInformation(): void {
    if (!this.schema || !this.baunitId ) {
      return;
    }

    this.unitPropertyInformationService.getBaunitInformation(this.baunitId)
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: Baunit) =>
          this.unitPropertyInformationService
            .getUnitPropertyInformation(result.cadastralNumber, this.page, this.pageSize)
            .subscribe({
              error: () => this.captureInformationSubscribeError(),
              next: (result2: BAunitLike) =>
                this.captureInformationSubscribe(result2)
            })
      });

  }

  openGeographicViewerMain(data: BaunitHead): void {
    this.dialog
      .open(GeographicViewerComponent, {
        width: '30%',
        height: '30%',
        disableClose: true,
        data: new ContentInfoSchema(data.baunitIdE, data)
      })
      .afterClosed();
  }

  openCadastralInformationProperty(data: BaunitHead): void {
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        minWidth: '99%',
        minHeight: '90%',
        disableClose: true,
        data: new ContentInfoSchema(
          data.baunitIdE, data, null,
          LIST_SCHEMAS_CONTROL_MAIN,
        )
      })
      .afterClosed();
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

  onFilterChange(value: string): void {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }

  toggleColumnVisibility(column: TableColumn<BaunitHead>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  /** Whether the number of selected elements matches the total number of rows. */
  isAllSelected(): boolean {
    const numSelected = this.selection.selected.length;
    const numRows = this.dataSource.data.length;
    return numSelected === numRows;
  }

  /** Selects all rows if they are not all selected; otherwise clear selection. */
  masterToggle(): void {
    this.isAllSelected()
      ? this.selection.clear()
      : this.dataSource.data.forEach((row) => this.selection.select(row));
  }

  trackByProperty<T>(index: number, column: TableColumn<T>): string {
    return column.property;
  }

  captureInformationSubscribe(result: InformationPegeable): void {
    this.contentInformation = result;
    this.captureInformationCadastralData();
  }

  captureInformationSubscribeError(): void {
    this.contentInformation = new InformationPegeable();
    this.dataSource.data = [];
  }

  generateObjectPageSearchData(data: SearchData): PageSearchData {
    return new PageSearchData(this.page, this.pageSize, data);
  }

  async initiateFilingProcedure(data: BaunitHead) {
    if (data && data?.baunitIdE) {
      const available = await this.baunitService.getBaunitIdEInOtherProcess(data?.baunitIdE);
      if (!available){
        this.snackbar.open(
          'No se puede radicar un nuevo control de cambios, unidad predial ya se encuentra actualmente en otro.',
          'CLOSE', { duration: 1000 }
        );
        return;
      }
      const url = `${envi.initiate_filing_procedure}`;
      this.sendInformation.setInformationRegister(data);
      this.router.navigate([`${url}`, data.baunitIdE])
        .then(r => {
        });
    }
  }

  isValidateField(value: string | undefined): boolean {
    return value !== null && value !== undefined && value.length >= 1;
  }

  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

    this.searchUnitPropertyInformation();
  }
}
