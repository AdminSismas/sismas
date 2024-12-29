import { Component, DestroyRef, inject, Input, ViewChild, OnInit } from '@angular/core';
import { NgFor, NgClass, NgIf, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormControl,FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { debounceTime, Observable, switchMap, tap } from 'rxjs';

// recursos de vex


// recursos de angular material




// recursos de archivos locales
import { contentInfoAttachment } from '../../../interfaces/content-info-attachment.model';
import { contentInfoProcedures } from '../../../interfaces/content-info-procedures.model';
import { MY_DATE_FORMATS, PAGE, PAGE_SIZE, PAGE_SIZE_OPTION, TABLE_COLUMN_PROPERTIES } from '../../../constants/procedures.constant';
import { ProceduresCollection } from '../../../interfaces/procedures-progress.model';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { ProceduresService } from '../../../services/procedures.service';
import { PageProceduresData } from '../../../interfaces/page-procedures-data.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort } from '@angular/material/sort';
import { InformationPegeable } from '../../../interfaces/information-pegeable.model';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
    selector: 'vex-table-procedures',
    standalone: true,
    templateUrl: './table-procedures.component.html',
    styleUrl: './table-procedures.component.scss',
    animations: [fadeInUp400ms, stagger40ms],
    providers: [
      { provide: MAT_DATE_FORMATS, useValue: MY_DATE_FORMATS },
    ],
    imports: [
        VexPageLayoutComponent,
        VexPageLayoutContentDirective,
        MatTableModule,
        MatInputModule,
        MatIconModule,
        MatMenuModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatButtonModule,
        CommonModule,
        FormsModule,
        NgFor,
        NgClass,
        NgIf,
        ReactiveFormsModule
    ]
})
export class GetTableProcedureComponent implements OnInit {
  /* ============== ATRIBUTES ============== */
  dataSource!: MatTableDataSource<ProceduresCollection>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  layoutCtrl = new UntypedFormControl('boxed');
  contentInformations!: InformationPegeable;
  private fBuilder = inject(FormBuilder);
  informationAddressForm!: FormGroup;
  seeInfo= false;
  textInfo = 'Prueba de texto, lorem,Prueba de texto, lorem,Prueba de texto, lorem,Prueba de texto, lorem';

  // beginAt!: Date;
  // beginAtE!: Date;
  // executionCode: string = '';
  // individualNumber: string = '';

  @Input()
  page:number = PAGE;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  totalElements = 0;
  columns: TableColumn<contentInfoProcedures>[] = TABLE_COLUMN_PROPERTIES;

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  /* ============== CONSTRUCTOR ============== */
  constructor(
    private proceduresService: ProceduresService,
    private readonly layoutService: VexLayoutService,
    private dateAdapter: DateAdapter<Date>,
    private alertSnakbar: MatSnackBar,
  ) {
    this.dateAdapter.setLocale('es-CO');
  }


  /* ============== METHODS ============== */
  /* ------- Meth. Lifecycle Hooks ------- */
  ngOnInit(): void {
    this.dataSource = new MatTableDataSource();
    

  }


 
  /* ------- Meth. HTML ------- */
  toggleColumnVisibility(column: TableColumn<contentInfoAttachment>, event: Event) {
    event.stopPropagation();
    event.stopImmediatePropagation();
    column.visible = !column.visible;
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  get visibleColumns() {
    return this.columns
      .filter((column) => column.visible)
      .map((column) => column.property);
  }

  refreshInformationpaginator(event: any): void {
    if (event == null) {
      return;
    }
    this.page = event.pageIndex;
    this.pageSize = event.pageSize;

  }

  onSearch():void {
    console.log(this.informationAddressForm);
    console.log(this.informationAddressForm.value);

    // this.getDataFromProceduresService();
  }

  validateDate(event: any): void {
    const input = event.target.value;
    const regex = /^[0-9\/]*$/; // Regex for numbers and slash
    if (!regex.test(input)) {
      event.target.value = input.replace(/[^0-9\/]/g, '');
    }
  }

  validateNumber(event: any): void {
    const input = event.target.value;
    event.target.value = input.replace(/[^0-9]/g, '');
  }


 






  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
  }


  private padZero(value: number): string {
    return value < 10 ? `0${value}` : value.toString();
  }



  captureInformationSubscribe(data: InformationPegeable) {
    this.contentInformations = data; 
    this.captureInformationProceduresData(); 
  }

  captureInformationProceduresData() {
    let data: contentInfoProcedures[];
    if (this.contentInformations != null && this.contentInformations.content != null) {
        data = this.contentInformations.content.map((row: ProceduresCollection) => new contentInfoProcedures({
            ...row,
            name: row.process?.name,
            processName: row.process?.name
        }));
        console.log("data: ", data);
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

  get beginAtForm(){
    return this.informationAddressForm.get('beginAtForm');
  }
  get beginAtEForm(){
    return this.informationAddressForm.get('beginAtEForm');
  }
  get executionCodeForm(){
    return this.informationAddressForm.get('executionCodeForm');
  }
  get individualNumberPartForm(){
    return this.informationAddressForm.get('individualNumberPartForm');
  }
}
