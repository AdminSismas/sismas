import { Component, DestroyRef, inject, Input, ViewChild } from '@angular/core';
import { NgFor, NgClass, NgIf, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormControl,FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { debounceTime, Observable, switchMap, tap } from 'rxjs';

// recursos de vex
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from "../../../../@vex/components/vex-page-layout/vex-page-layout-content.directive";
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';

// recursos de angular material
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatButtonModule } from '@angular/material/button';
import { MatSnackBar } from '@angular/material/snack-bar';



// recursos de archivos locales
import { contentInfoAttachment } from '../../interfaces/content-info-attachment.model';
import { contentInfoProcedures } from '../../interfaces/content-info-procedures.model';
import { MY_DATE_FORMATS, PAGE, PAGE_SIZE, PAGE_SIZE_OPTION, TABLE_COLUMN_PROPERTIES } from '../../constants/procedures.constant';
import { ProceduresCollection } from '../../interfaces/procedures-progress.model';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { ProceduresService } from '../../services/procedures.service';
import { PageProceduresData } from '../../interfaces/page-procedures-data.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatSort } from '@angular/material/sort';
import { InformationPegeable } from '../../interfaces/information-pegeable.model';
import { error } from 'console';
import { asyncValidation, dateComparisonValidator } from './validate-form/validate-form-utils';





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
export class TableProceduresComponent {
  /* ============== ATRIBUTES ============== */
  dataSource!: MatTableDataSource<ProceduresCollection>;
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
  layoutCtrl = new UntypedFormControl('boxed');
  contentInformations!: InformationPegeable;
  private fBuilder = inject(FormBuilder);
  informationAddressForm!: FormGroup;
  seeInfo:boolean= false;
  textInfo:string = 'Prueba de texto, lorem,Prueba de texto, lorem,Prueba de texto, lorem,Prueba de texto, lorem';

  // beginAt!: Date;
  // beginAtE!: Date;
  // executionCode: string = '';
  // individualNumber: string = '';

  @Input()
  page:number = PAGE;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  totalElements: number = 0;
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
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
    
    // this.beginAt = new Date();
    // this.executionCode = '0';
    this.initForm();
    this.beginAtgreaterThanDate();
    this.executionCodeValidate();

    this.individualNumberPartValid();
  
    //this.getDataFromProceduresService();
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

    this.getDataFromProceduresService();
  }

  onSearch():void {
    this.getDataFromProceduresService();
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


 

  public beginAtgreaterThanDate(){

    this.beginAtForm?.valueChanges.pipe(
      debounceTime(100),  // Espera 500 ms después del último cambio
      tap(value => {

        const beginAtComparation = new Date(this.beginAtForm?.value);
        const beginAtEComparation = new Date(this.beginAtEForm?.value);

        if(beginAtComparation > beginAtEComparation ){
          this.beginAtForm?.setErrors({ dateComparison: true });
        }else{
          this.beginAtForm?.setErrors(null);
        }
        // Aquí podrías realizar una llamada HTTP o cualquier otra operación
        console.log(value, 'executoingCode');
   
      }))
    .subscribe(data=>{
      console.log(data, 'executoingCode');
    })
  }

  public executionCodeValidate(){
    this.executionCodeForm?.valueChanges.pipe(
      debounceTime(300),  // Espera 500 ms después del último cambio
      tap(value => {
        if(value !== '' && value !== 0  && value !== null){

            this.individualNumberPartForm?.disable()
            this.individualNumberPartForm?.reset()
            this.seeInfo = true;

          }else{
          this.individualNumberPartForm?.enable()
            this.individualNumberPartForm?.reset()
            this.seeInfo = false;
        }
   
      }))
    .subscribe()
  }


  public individualNumberPartValid(){
    this.individualNumberPartForm?.valueChanges.pipe(
      debounceTime(300),  // Espera 500 ms después del último cambio
      tap(value => {
        if(value !== '' && value !== 0  && value !== null){

            this.executionCodeForm?.disable()
            this.executionCodeForm?.reset()
            this.seeInfo = true;

          }else{
          this.executionCodeForm?.enable()
            this.executionCodeForm?.reset()
            this.seeInfo = false;
        }
   
      }))
    .subscribe()
  }

  /* ------- Meth. Common ------- */
  objectParameters(): PageProceduresData {
    let beginAtETrans = new Date();

    if(this.beginAtEForm?.value === null){
      // this.beginAtE?.setValue(new Date())
       beginAtETrans = new Date()
    }else{
      beginAtETrans = new Date(this.beginAtEForm?.value)
    }
    const beginAtTrans = new Date(this.beginAtForm?.value)

    const formValue: PageProceduresData =  {
      page: this.page,
      size: this.pageSize,
      beginAt: this.formatDate(beginAtTrans),
      beginAtE: this.formatDate(beginAtETrans),
      executionCode: this.executionCodeForm?.value,
      individualNumber: this.individualNumberPartForm?.value,
    }
    
    return formValue;
  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
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

/**
   * Init information address form
   */
private initForm(): void {
  this.informationAddressForm = this.fBuilder.group({
    // beginAtForm: this.fBuilder.control(null),
    // beginAtEForm: this.fBuilder.control(null),
    // executionCodeForm: this.fBuilder.control(0, []), // Solo letras y permite espacio
    // individualNumberPartForm: this.fBuilder.control( null, []),
    beginAt: [null],
    beginAtE: [null],
    executionCode: [0,[]],
    individualNumberPart: [null,[]]
  },
  {
    // Aplica el validador a nivel de formulario
    validators: dateComparisonValidator('beginAtForm', 'beginAtEForm'),
  }
);
  this.beginAtEForm?.setValue(new Date());


  // if (this.addEditInformationData.type === 'new') {
  //   const names: string[] = ['direccionId'];
  //   names.forEach((name: string) => {
  //     if (this.informationAddressForm.controls[name]) {
  //       this.informationAddressForm.controls[name].clearValidators();
  //       this.informationAddressForm.controls[name].updateValueAndValidity();
  //     }
  //   })
  // }
}


  /* ------- Meth. Services ------- */
  getDataFromProceduresService() {

    const data = this.objectParameters();
    this.proceduresService.getFilterTableProcedureService(data)
    .subscribe({
      next: (result: any) => {
          console.log("datos de api: ", result);
          this.captureInformationSubscribe(result);
      },
      error: (error) => {
          this.alertSnakbar.open('Hubo un error, verifique la información de los filtros', 'Close', {
            duration: 3000,
            horizontalPosition: 'center'
          });
          console.error('Hubo un error al obtener los datos: ', error);
      },
      complete: () => {
          console.log('Carga completa de datos');
      }
    }); 
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
    return this.informationAddressForm.get('beginAtForm')
  }
  get beginAtEForm(){
    return this.informationAddressForm.get('beginAtEForm')
  }
  get executionCodeForm(){
    return this.informationAddressForm.get('executionCodeForm')
  }
  get individualNumberPartForm(){
    return this.informationAddressForm.get('individualNumberPartForm')
  }
}
