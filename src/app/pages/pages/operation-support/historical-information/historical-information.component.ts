import { Component, DestroyRef, inject, Input,ViewChild, OnInit, AfterViewInit } from '@angular/core';
import { InConstructionComponent } from '../../../../apps/components/in-construction/in-construction.component';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatMenuModule } from '@angular/material/menu';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatPseudoCheckboxModule } from '@angular/material/core';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { FluidHeightDirective } from 'src/app/apps/directives/fluid-height.directive';
import { BaunitHead } from 'src/app/apps/interfaces/information-property/baunit-head.model';
import { SearchData } from 'src/app/apps/interfaces/search-data.model';
import { PageSearchData } from 'src/app/apps/interfaces/page-search-data.model';
import { InformationPegeable } from 'src/app/apps/interfaces/information-pegeable.model';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { LIST_SCHEMAS_CONTROL_CHANGES, LIST_SCHEMAS_CONTROL_HISTORY, LIST_SCHEMAS_CONTROL_MAIN, PAGE, PAGE_SIZE_OPTION, PAGE_SIZE_TABLE_CADASTRAL, TABLE_COLUMN_PROPERTIES, TYPEINFORMATION_VISUAL } from 'src/app/apps/constants/constant';
import { ContentInfoSchema } from 'src/app/apps/interfaces/content-info-schema';
import { LayoutCardCadastralInformationPropertyComponentComponent } from 'src/app/apps/components/information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import { GeographicViewerComponent } from 'src/app/apps/components/geographic-viewer/geographic-viewer.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ValidateInformationBaunitService } from 'src/app/apps/services/general/validate-information-baunit.service';
import { SendInformationRegisterService } from 'src/app/apps/services/register-procedure/send-information-register.service';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { InfoTableService } from 'src/app/apps/services/general/info-table.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Router } from '@angular/router';
import { SelectionModel } from '@angular/cdk/collections';
import { Observable } from 'rxjs';
import { FilterHistoricalInformationComponent } from './filter-historical-information/filter-historical-information.component';
import { environment } from 'src/environments/environments';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { Operation } from 'src/app/apps/interfaces/bpm/operation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';

@Component({
  selector: 'vex-historical-information',
  animations: [fadeInUp400ms, stagger40ms],
  standalone: true,
  imports: [
    VexPageLayoutComponent,
    VexPageLayoutHeaderDirective ,
    VexBreadcrumbsComponent,
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
    MatPseudoCheckboxModule,
    NgFor,
    NgClass,
    MatPaginatorModule,
    FormsModule,
    MatDialogModule,
    MatInputModule,
    MatTabsModule,
    MatSelectModule,
    MatCheckboxModule,
  ],
  templateUrl: './historical-information.component.html',
  styleUrl: './historical-information.component.scss'
})
export class HistoricalInformationComponent implements OnInit, AfterViewInit {


  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
    contentInformations!: InformationPegeable;
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

    @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort?: MatSort;

    @Input({ required: true }) executionId!: string;

    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    constructor(
      private router: Router,
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
              LIST_SCHEMAS_CONTROL_HISTORY,
              TYPEINFORMATION_VISUAL
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
        .open(FilterHistoricalInformationComponent, {
          minWidth: '50%',
          width: '70%',
          minHeight: '50%',
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

    cleanJsonValues(data: any): any {
      const cleanedData: any = {};

      // Iterar sobre las claves del JSON
      Object.keys(data).forEach((key) => {
        const value = data[key];
        if (typeof value === 'string') {
          // Eliminar solo los guiones bajos (__) dejando los números
          cleanedData[key] = value.replace(/_/g, '');
        } else {
          cleanedData[key] = value; // Mantener valores no string tal como están
        }
      });
      return cleanedData;
    }

    captureInformationCadastralData(): void {
      let data: BaunitHead[];
      if (this.contentInformations?.content != null) {
        data = this.contentInformations.content;
        data = data.map((row: BaunitHead) => new BaunitHead(row));
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
      const formattedValues:any = [
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

      const result = formattedValues.join(''); // Une sin espacios
      this.searValueData(value,result);
    }

    searValueData(data: SearchData,value:string): void {
      console.log(data);
      this.baunitService.historiAdvancedSearch(this.generateObjectPageSearchData(data),value)
      .subscribe(value=>{
        console.log(value);
        this.captureInformationSubscribe(value);
      });
    }


    deleteInformations(customer: BaunitHead): void {
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

    refreshInformationPaginator(event: PageEvent): void {
      if (event == null) {
        return;
      }
      console.log(this.page, ' paginaciom');
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;

      const validate: boolean = this.validateRefreshCadastralData();
      if (!validate) {
        throw new Error('No fue posible actualizar los datos de la tabla');
      }
    }

    captureInformationSubscribe(result: InformationPegeable): void {
      this.contentInformations = result;
      this.captureInformationCadastralData();
    }

    captureInformationSubscribeError(): void {
      this.contentInformations = new InformationPegeable();
      this.dataSource.data = [];
    }

    generateObjectPageSearchData(data: SearchData): PageSearchData {
      return new PageSearchData(this.page, this.pageSize, data);
    }

    async initiateFilingProcedure(data: BaunitHead ) {
      if (data && data?.baunitIdE) {
        const available = await this.baunitService.getBaunitIdEInOtherProcess(data?.baunitIdE);
        if (!available){
          this.snackbar.open(
            'No se puede radicar un nuevo control de cambios, unidad predial ya se encuentra actualmente en otro.',
            'CLOSE', { duration: 5000 }
          );
          return;
        }
        const url = `${environment.initiate_filing_procedure}`;
        this.sendInformation.setInformationRegister(data);
        this.router.navigate([`${url}`, data.baunitIdE])
          .then(r => {
          });
      }
    }

    isValidateField(value: string | undefined): boolean {
      return value !== null && value !== undefined && value.length >= 1;
    }
}
