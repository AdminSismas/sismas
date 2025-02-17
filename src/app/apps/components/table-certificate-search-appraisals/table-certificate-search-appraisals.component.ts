/* eslint-disable @typescript-eslint/no-explicit-any */
import { AfterViewInit, Component, DestroyRef, inject, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { BaunitHead } from '../../interfaces/information-property/baunit-head.model';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
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
import { CommonModule, NgClass, NgIf } from '@angular/common';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexPageLayoutHeaderDirective } from '@vex/components/vex-page-layout/vex-page-layout-header.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatInputModule } from '@angular/material/input';
import { InfoTableService } from '../../services/general/info-table.service';
import { SearchData } from '../../interfaces/search-data.model';
import { InformationPegeable } from '../../interfaces/information-pegeable.model';
import { PageSearchData } from '../../interfaces/page-search-data.model';
import { Observable } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { FilterCertificateSearchAppraisalsComponent } from './filter-certificate-search-appraisals/filter-certificate-search-appraisals.component';
import {
  LIST_SCHEMAS_CONTROL_MAIN,
  PAGE,
  PAGE_OPTION__10_20_50_100,
  PAGE_SIZE,
  TABLE_COLUMN_PROPERTIES, TYPEINFORMATION_VISUAL,
  MODAL_LARGE,
  MODAL_MEDIUM,
  MODAL_SMALL,
} from '../../constants/constant';
import {
  LayoutCardCadastralInformationPropertyComponentComponent
} from '../information-property/layout-card-cadastral-information-property-component/layout-card-cadastral-information-property-component.component';
import { ContentInfoSchema } from '../../interfaces/content-info-schema';
import { GeographicViewerComponent } from '../geographic-viewer/geographic-viewer.component';
import { environment as envi } from '../../../../environments/environments';
import { SendInformationRegisterService } from '../../services/register-procedure/send-information-register.service';
import { ValidateInformationBaunitService } from '../../services/general/validate-information-baunit.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { CurrencyLandsPipe } from '../../pipes/currency-lands.pipe';
import { HttpErrorResponse } from '@angular/common/http';
import { BpmProcessService } from '../../services/bpm/bpm-process.service';
import { UserService } from 'src/app/pages/pages/auth/login/services/user.service';
import { DecodeJwt } from '../../interfaces/user-details/user.model';
import { contentInfoAttachment } from '../../interfaces/content-info-attachment.model';
import { ViewFileDocumentManagementComponent } from '../view-file-document-management/view-file-document-management.component';
import { ViewCertificateManagementComponent } from '../view-certificate-management/view-certificate-management.component';


@Component({
  selector: 'vex-table-certificate-search-appraisals',	
  templateUrl: './table-certificate-search-appraisals.component.html',
  styleUrls: ['./table-certificate-search-appraisals.component.scss'],
  animations: [fadeInUp400ms, stagger40ms],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgClass,
    NgIf,
    ReactiveFormsModule,
    // Vex
    VexBreadcrumbsComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    VexPageLayoutHeaderDirective,
    // Material
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    // Custom
    CurrencyLandsPipe
  ]
})
export class TableCertificateSearchAppraisalsComponent implements OnInit, AfterViewInit,OnChanges {

  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  contentInformation!: InformationPegeable;
  searchData!: SearchData;
  user: DecodeJwt | null = null;

  @Input()
  columns: TableColumn<BaunitHead>[] = TABLE_COLUMN_PROPERTIES;
  page = PAGE;
  totalElements = 0;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_OPTION__10_20_50_100;
  titleArray: string[] = ['Mi trabajo'];
  titleMenu: string = 'Búsqueda';
  principaltitleMenu: string = 'Búsqueda avanzada';
  seeAction:boolean = true;
  @Input() certificateType!: string;


  dataSource!: MatTableDataSource<BaunitHead>;
  selection: SelectionModel<BaunitHead> = new SelectionModel<BaunitHead>(true, []);
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  initParams?: string;



  @Input() tituloPage?:string = '';
  @Input() rulePage?:string = '';
    

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
    private router: Router,
    
    private bpmProcessService: BpmProcessService,
    private route: ActivatedRoute,
    private dialog: MatDialog,
    private snackbar: MatSnackBar,
    private infoTableService: InfoTableService,
    private readonly layoutService: VexLayoutService,
    private sendInformation: SendInformationRegisterService,
    private baunitService: ValidateInformationBaunitService,
    private userService: UserService,
  ) {
    console.log('TableCadastralSearchComponent , Configuracion');
    this.detectCurrentUrl();
  }

  dialogRef!: MatDialogRef<ViewFileDocumentManagementComponent>;
  
  detectCurrentUrl(): void {
    const currentUrl = this.router.url;
    console.log('Current URL:', currentUrl);
    const lastSegment = this.getLastSegment(currentUrl);
    console.log('Last Segment:', lastSegment);
    if (lastSegment === 'cadastralSearch') {
      this.titleAsing('Búsqueda catastral');
      this.menuAsing('Búsqueda avanzada','Búsqueda catastral');
    }
    // else{
    //   this.titleAsing('Búsqueda catastral DA');
    //   this.menuAsing('Búsqueda avanzada DA');

    // }
  }

  getLastSegment(url: string): string {
    const segments = url.split('/');
    return segments.pop() || '';
  }
  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  ngOnInit(): void {
    this.user = this.userService.getUser();

    this.bpmProcessService.setPermissions({ executionId: '', message: '' });
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

   ngOnChanges(changes: SimpleChanges) {
      if (changes['tituloPage'] && this.tituloPage) {
        this.tituloPage = this.tituloPage ;
        this.titleAsing(this.tituloPage);
        this.menuAsing('Búsqueda avanzada DA',this.tituloPage);
        this.seeAction = false;
      }
    }
  
  titleAsing(value: string): void {
    this.titleArray.push(value);
  }

  menuAsing(title:string,principal:string): void {
  this.titleMenu = title;
  this.principaltitleMenu = principal;
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
          TYPEINFORMATION_VISUAL,
          '',
          [],
          this.rulePage
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
      .open(FilterCertificateSearchAppraisalsComponent, {
        ...MODAL_MEDIUM,
        disableClose: true,
        data: {
          searchData: this.searchData,
          rulePage: this.rulePage
        }
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

    if (searchData.baunitIdE) {
      this.searchPropertiesByBaunitIdE(searchData.baunitIdE);
      return true;
    }

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
  searchPropertiesByBaunitIdE(baunit: string) {
    this.infoTableService.getDataBaunitIdE(this.page, this.pageSize, baunit)
      .subscribe({
        next: (result: InformationPegeable) => this.captureInformationSubscribe(result),
        error: (error: HttpErrorResponse) => {
          this.captureInformationSubscribeError();
          if(error.status === 404){
            this.snackbar.open('No se encontró un predio con ese número', 'Cerrar', { duration: 5000 });
          }
        }
      });
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
    // eslint-disable-next-line @typescript-eslint/no-unused-expressions
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
          'CERRAR', { duration: 10000 }
        );
        return;
      }
      const url = `${envi.initiate_filing_procedure}`;
      this.sendInformation.setInformationRegister(data);
      this.router.navigate([`${url}`, data.baunitIdE])
        .then();
    }
  }

  isValidateField(value: string | undefined): boolean {
    return value !== null && value !== undefined && value.length >= 1;
  }

  cleanHyphenatedText(value: string | undefined): string {
    if (!value) {
      return '';
    }
    return value.includes('-') ? value.replace(/\s*-\s*/g, '-') : value;
  }

  viewFile(data: BaunitHead): void {

    const typeCertificate = this.certificateType;

    console.log('Data:', data.baunitIdE);

    this.dialog
      .open(ViewCertificateManagementComponent, {
        minWidth: '370px',
        width: '98%',
        height: '86%',
        disableClose: true,
        data: {
          baunitID: data.baunitIdE,
          typeCertificate: typeCertificate
          
        
        }
      });

    this.dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }
}
