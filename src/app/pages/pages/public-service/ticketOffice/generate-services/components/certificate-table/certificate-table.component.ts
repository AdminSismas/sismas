import { SelectionModel } from '@angular/cdk/collections';
import { NgClass, NgIf } from '@angular/common';
import { AfterViewInit, Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';
import { ActivatedRoute, Router } from '@angular/router';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { Observable } from 'rxjs';
import {
  LayoutCardCadastralInformationPropertyComponentComponent
} from 'src/app/apps/components/information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import {
  LIST_SCHEMAS_CONTROL_MAIN,
  MODAL_LARGE,
  MODAL_MEDIUM,
  MODAL_SMALL,
  PAGE,
  PAGE_SIZE_OPTION,
  PAGE_SIZE_TABLE_CADASTRAL,
  TYPE_INFORMATION_VISUAL
} from '../../../../../../apps/constants/general/constants';
import { TABLE_COLUMN_PROPERTIES } from '../../../../../../apps/constants/general/procedures.constant';
import { ContentInfoSchema } from '../../../../../../apps/interfaces/general/content-info-schema';
import { InformationPegeable } from '../../../../../../apps/interfaces/general/information-pegeable.model';
import { BaunitHead } from 'src/app/apps/interfaces/information-property/baunit-head.model';
import { PageSearchData } from '../../../../../../apps/interfaces/general/page-search-data.model';
import { SearchData } from '../../../../../../apps/interfaces/general/search-data.model';
import { InfoTableService } from 'src/app/apps/services/general/info-table.service';
import { ValidateInformationBaunitService } from 'src/app/apps/services/general/validate-information-baunit.service';
import {
  SendInformationRegisterService
} from 'src/app/apps/services/register-procedure/send-information-register.service';
import { environment } from '@environments/environments';
import {
  FilterCadastralSearchComponent
} from 'src/app/apps/components/tables/table-cadastral-search/filter-cadastral-search/filter-cadastral-search.component';
import {
  GeographicViewerComponent
} from 'src/app/apps/components/geographics/geographic-viewer/geographic-viewer.component';

@Component({
  selector: 'vex-certificate-table',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    VexPageLayoutComponent,
    MatButtonToggleModule,
    ReactiveFormsModule,
    VexPageLayoutContentDirective,
    NgIf,
    MatButtonModule,
    MatTooltipModule,
    MatIconModule,
    MatMenuModule,
    MatTableModule,
    MatSortModule,
    MatCheckboxModule,
    NgClass,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule
],
  templateUrl: './certificate-table.component.html',
  styleUrl: './certificate-table.component.scss'
})
export class CertificateTableComponent implements OnInit, AfterViewInit {
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformation!: InformationPegeable;
  searchData!: SearchData;

  @Input()
  columns: TableColumn<BaunitHead>[] = TABLE_COLUMN_PROPERTIES;
  page = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE_TABLE_CADASTRAL;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;

  dataSource!: MatTableDataSource<BaunitHead>;
  selection: SelectionModel<BaunitHead> = new SelectionModel<BaunitHead>(true, []);
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  initParams?: string;

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private infoTableService: InfoTableService,
    private readonly layoutService: VexLayoutService,
    private sendInformation: SendInformationRegisterService,
    private baunitService: ValidateInformationBaunitService
  ) {
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    if (this.route.snapshot.queryParams['npn']) {
      this.initParams = this.route.snapshot.queryParams['npn'];
      this.searValueData({}, this.initParams as string);
      setTimeout(() => {
        this.dialog.open(LayoutCardCadastralInformationPropertyComponentComponent, {
          ...MODAL_LARGE,
          disableClose: true,
          data: new ContentInfoSchema(
            this.dataSource.data[0].baunitIdE,
            this.dataSource.data[0],
            null,
            LIST_SCHEMAS_CONTROL_MAIN,
          )
        });
      }, 300);
    }
  }

  ngAfterViewInit(): void {
    if (this.paginator) {
      this.dataSource.paginator = this.paginator;
    }

    if (this.sort) {
      this.dataSource.sort = this.sort;
    }
  }

  openGeographicViewerMain(data: BaunitHead): void {
    this.dialog
      .open(GeographicViewerComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: new ContentInfoSchema(data.baunitIdE, data)
      })
      .afterClosed();
  }

  openCadastralInformationProperty(data: BaunitHead): void {
    this.dialog
      .open(LayoutCardCadastralInformationPropertyComponentComponent, {
        ...MODAL_LARGE,
        disableClose: true,
        data: new ContentInfoSchema(
          data.baunitIdE, data, null,
          LIST_SCHEMAS_CONTROL_MAIN,
          TYPE_INFORMATION_VISUAL
        )
      })
      .afterClosed();
  }

  createAdvancedSearch(): void {
    if(this.searchData){
      const cleanValue = this.cleanJsonValues(this.searchData);
      this.searchData = cleanValue;
    }
    this.dialog
      .open(FilterCadastralSearchComponent, {
        ...MODAL_MEDIUM,
        disableClose: true,
        data: this.searchData
      })
      .afterClosed()
      .subscribe((searchData: SearchData) => {
        if (this.searchData !== null && searchData) {
          this.searchData = searchData;
          if (this.paginator) {
            this.paginator.firstPage();
          }
          this.validateRefreshCadastralData();
        }
      });
  }

  cleanJsonValues(data: SearchData): SearchData {
    const cleanedData: SearchData = {};

    // Iterar sobre las claves del JSON
    Object.keys(data).forEach((key) => {
      const typedKey = key as keyof SearchData;
      const value = data[typedKey];
      if (typeof value === 'string') {
        // Eliminar solo los guiones bajos (__) dejando los números
        cleanedData[typedKey] = value.replace(/_/g, '');
      } else {
        cleanedData[typedKey] = value!; // Mantener valores no string tal como están
      }
    });
    return cleanedData;
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

  searchPropertiesByRegistration(data: SearchData): void {
    this.infoTableService.getDataPropertyByRegistration(this.generateObjectPageSearchData(data))
      .subscribe(
        {
          error: () => this.captureInformationSubscribeError(),
          next: (result: InformationPegeable) => this.captureInformationSubscribe(result)
        }
      );
  }

  searchPropertiesByDocument(data: SearchData): void {
    this.infoTableService.getDataPropertyByDocument(this.generateObjectPageSearchData(data))
      .subscribe(
        {
          error: () => this.captureInformationSubscribeError(),
          next: (result: InformationPegeable) => this.captureInformationSubscribe(result)
        }
      );
  }

  searchPropertiesByName(data: SearchData): void {
    this.infoTableService.getDataPropertyByName(this.generateObjectPageSearchData(data))
      .subscribe(
        {
          error: () => this.captureInformationSubscribeError(),
          next: (result: InformationPegeable) => this.captureInformationSubscribe(result)
        }
      );
  }

  searchPropertiesByAddress(data: SearchData): void {
    this.infoTableService.getDataPropertyByAddress(this.generateObjectPageSearchData(data))
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: InformationPegeable) => this.captureInformationSubscribe(result)
      });
  }

  searchNationalPredialNumber(data: SearchData): void {
    this.infoTableService.getDataNationalPredialNumber(this.generateObjectPageSearchData(data))
      .subscribe({
        error: () => this.captureInformationSubscribeError(),
        next: (result: InformationPegeable) => this.captureInformationSubscribe(result)
      });
  }

  validateRefreshCadastralData(): boolean {
    if (this.searchData == null) {
      return false;
    }
    const searchData: SearchData = this.searchData;

    if (this.isValidateField(searchData?.registration)) {
      this.searchPropertiesByRegistration(this.searchData);
      return true;
    }

    if (this.isValidateField(searchData?.number) &&
      this.isValidateField(searchData?.domIndividualTypeNumber)) {
      this.searchPropertiesByDocument(this.searchData);
      return true;
    }

    if (this.isValidateField(searchData?.firstName) &&
      this.isValidateField(searchData?.lastName)) {
      this.searchPropertiesByName(this.searchData);
      return true;
    }

    if (this.isValidateField(searchData?.textAddress)) {
      this.searchPropertiesByAddress(this.searchData);
      return true;
    }

    if (searchData.sidewalk !== null && searchData.sidewalk !== undefined && searchData.sidewalk.length > 10 ||
      searchData.block !== null && searchData.block !== undefined && searchData.block.length > 10) {
      this.searchNationalPredialNumber(this.searchData);
      return true;
    }

    if (searchData) {
      this.formatFieldValue(this.searchData);
      return true;
    }
    return false;
  }

  formatFieldValue(value:SearchData) {
    const formattedValues = [
     value.dpto,
     value.mpio,
     value.zonas,
     value.sectorb,
     value.comuna,
     value.barrio,
     value.manVer,
     value.terreno,
     value.condicion,
     value.edificio,
     value.piso,
     value.unidadPredial
    ];

    let result;

    if (value?.codigoCompleto) {
      result = value.codigoCompleto;
    } else {
      result = formattedValues.join('');
    }

    this.searValueData(value, result);
  }

  searValueData(searData:SearchData,data: string): void {
    this.baunitService.advancedSearchCadastral(this.generateObjectPageSearchData(searData),data)
    .subscribe(value=>{
      this.captureInformationSubscribe(value);
    });
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
    if(this.isAllSelected()){
      this.selection.clear();
      return;
    }
    this.dataSource.data.forEach((row) => this.selection.select(row));
  }



  refreshInformationPaginator(event: PageEvent): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

    const validate: boolean = this.validateRefreshCadastralData();
    if (!validate) {
      throw new Error('No fue posible actualizar los datos de la tabla');
    }
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
          'CERRAR', { duration: 5000 }
        );
        return;
      }
      const url = `${environment.initiate_filing_procedure}`;
      this.sendInformation.setInformationRegister(data);
      this.router.navigate([`${url}`, data.baunitIdE])
        .then();
    }
  }

  isValidateField(value: string | undefined): boolean {
    return value !== null && value !== undefined && value.length >= 1;
  }

}
