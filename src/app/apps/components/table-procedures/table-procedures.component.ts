import { Component, DestroyRef, inject, Input, ViewChild, OnInit, OnDestroy } from '@angular/core';
import { NgFor, NgClass, NgIf, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormControl,FormBuilder, FormGroup, Validators, FormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { debounceTime, distinctUntilChanged, Observable, Subscription, switchMap, tap } from 'rxjs';

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
import { MatSort, MatSortModule } from '@angular/material/sort';
import { InformationPegeable } from '../../interfaces/information-pegeable.model';
import { error } from 'console';
import { asyncValidation, dateComparisonValidator } from './validate-form/validate-form-utils';
import { InputComponent } from '../input/input.component';
import { TaskResponseModel } from '../../interfaces/task-response.model';
import { DetailInformationTasksComponent } from 'src/app/pages/pages/my-work/tasks/components/detail-information-tasks/detail-information-tasks.component';
import { MatDialog } from '@angular/material/dialog';
import { PAGE_OPTION__10_20_50_100 } from '../../constants/constant';





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
        MatInputModule,
        MatMenuModule,
        ReactiveFormsModule,
        MatPaginatorModule,
        MatDatepickerModule,
        MatCheckboxModule,
        MatButtonModule,
        MatIconModule ,
        MatSortModule,
        MatTableModule,
        CommonModule,
        FormsModule,
        MatDatepickerModule,
        NgFor,
        NgClass,
        NgIf,
        ReactiveFormsModule,
        InputComponent
    ]
})
export class TableProceduresComponent implements OnInit, OnDestroy {
  /* ============== ATRIBUTES ============== */
  /* ============== ATRIBUTES ============== */
dataSource!: MatTableDataSource<ProceduresCollection>;
searchCtrl: UntypedFormControl = new UntypedFormControl();
isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
layoutCtrl = new UntypedFormControl('boxed');
contentInformations!: InformationPegeable;
disabledEndDate = false;
private fBuilder = inject(FormBuilder);
informationEjecution!: FormGroup;
seeInfo= false;
seeInfoDocument= false;
public procedureDetail:TaskResponseModel= new TaskResponseModel();

// Array para almacenar las suscripciones
private subscriptions: Subscription  | undefined[] = [];

@Input()
  page:number = PAGE;
  pageSize: number = PAGE_SIZE;
  pageSizeOptions: number[] = PAGE_OPTION__10_20_50_100;
  totalElements = 0;
  columns: TableColumn<contentInfoProcedures>[] = TABLE_COLUMN_PROPERTIES;

  @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;

  private readonly destroyRef: DestroyRef = inject(DestroyRef);


  /* ============== CONSTRUCTOR ============== */
  constructor(
    private dialog: MatDialog,
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
    console.log('componente');
    this.dataSource = new MatTableDataSource();
    // this.searchCtrl.valueChanges
    //   .pipe(takeUntilDestroyed(this.destroyRef))
    //   .subscribe((value) => this.onFilterChange(value));
    
    // this.beginAt = new Date();
    // this.getDataFromProceduresService();
    this.initForm();
    this.executionCodeValidate();
    this.individualNumberPartValid();

    this.defaultTableData();

    // Validacion de fechas
    this.beginAtgreaterThanDate();
    this.beginAtEFormGreaterThanDate();

  }

   // Método para cancelar todas las suscripciones
   ngOnDestroy() {
    // Cancelamos todas las suscripciones al destruir el componente
    console.log('Todas las suscripciones han sido canceladas');
  }

  /**
   * Init information address form
   */
private initForm(): void {
  this.informationEjecution = this.fBuilder.group({
    beginAtForm: this.fBuilder.control(null,[Validators.required]),
    beginAtEForm: this.fBuilder.control(null),
    executionCodeForm: this.fBuilder.control(0, [Validators.pattern(/^[0-9]*$/)]), // Solo letras y permite espacio
    individualNumberPartForm: this.fBuilder.control( null, [Validators.pattern(/^[0-9]*$/)]),
  
  },
  {
    // Aplica el validador a nivel de formulario
    validators: dateComparisonValidator('beginAtForm', 'beginAtEForm'),
  }
);
  this.beginAtForm?.setValue(new Date());
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
      const data = this.objectParameters();
      this.getDataFromProceduresService(data);
    }

    public informationDetail(value:any){
      console.log(value, 'Registro de la tabla');

      this.proceduresService.viewDetailIdProcedures(
        +value.executionCode)
        .subscribe( result => {
          this.procedureDetail = result;
            this.seeTaskProperty(this.procedureDetail,+value.executionCode);
          
        });
    }
  
    seeTaskProperty(value:TaskResponseModel,taskId:number):void {
      this.dialog.open(DetailInformationTasksComponent, {
        width: '50%',
        data: { taskId: taskId ,value }
      });
    }


    public beginAtgreaterThanDate(){

      this.beginAtForm?.valueChanges.pipe(
        debounceTime(100),  // Espera 500 ms después del último cambio
        distinctUntilChanged(),
        tap(value => {
  
          const beginAtComparation = this.beginAtForm?.value ? new Date(this.beginAtForm?.value): null ;
          const beginAtEComparation = this.beginAtEForm?.value ? new Date(this.beginAtEForm?.value) : null ;
  
          if (beginAtComparation && beginAtEComparation && new Date(beginAtEComparation) < new Date(beginAtComparation)){
            this.beginAtForm?.setErrors({ dateComparison: true });
          }else{
            this.beginAtForm?.setErrors(null);
          }
          // Aquí podrías realizar una llamada HTTP o cualquier otra operación
          console.log(value, 'executoingCode');
     
        }))
      .subscribe(data=>{
        console.log(data, 'executoingCode');
      });
    }

    public beginAtEFormGreaterThanDate(){

      this.beginAtEForm?.valueChanges.pipe(
        debounceTime(100),  // Espera 500 ms después del último cambio
        distinctUntilChanged(),
        tap(value => {
  
          const beginAtComparation = this.beginAtForm?.value ? new Date(this.beginAtForm?.value): null ;
          const beginAtEComparation = this.beginAtEForm?.value ? new Date(this.beginAtEForm?.value) : null ;
  
          if (beginAtComparation && beginAtEComparation && new Date(beginAtEComparation) < new Date(beginAtComparation)){
            this.beginAtEForm?.setErrors({ dateComparison: true });
          }else{
            this.beginAtEForm?.setErrors(null);

          }
        
          console.log('Validadorde fecha');
      
     
        }))
      .subscribe();
    }
  

    public executionCodeValidate(){
       this.executionCodeForm?.valueChanges.pipe(
     
        debounceTime(300),  // Espera 500 ms después del último cambio
        distinctUntilChanged(), // Solo emite cuando el valor cambia
        tap(value => {

          console.log(value);
          if(value !== '' && value !== 0  && value !== null){
  
              this.individualNumberPartForm?.disable();
              // this.individualNumberPartForm?.reset();
              this.seeInfo = true;
  
            }else{
            this.individualNumberPartForm?.enable();
              // this.individualNumberPartForm?.reset();
              this.seeInfo = false;
          }
     
        }))
      .subscribe();

    }

    public individualNumberPartValid(){
      this.individualNumberPartForm?.valueChanges.pipe(
        debounceTime(300),  // Espera 300 ms después del último cambio
        distinctUntilChanged(), // Solo emite cuando el valor cambia
        
        tap(value => {
          if(value !== '' && value !== 0 && value !== null){
            // Deshabilitar el campo sin resetear su valor
            this.executionCodeForm?.disable();
            this.seeInfoDocument = true;
          } else {
            // Habilitar el campo sin resetear su valor
            this.executionCodeForm?.enable();
            this.seeInfoDocument = false;
          }
        })
      ).subscribe();
    }
  

    public defaultTableData(){
    this.executionCodeForm?.setValue(0); 

    this.individualNumberPartForm?.setValue(''); 
    const formValue: PageProceduresData =  {
      page: this.page,
      size: this.pageSize,
      beginAt: '13/01/2024',
      beginAtE: '',
      executionCode: this.executionCodeForm?.value,
      individualNumber: '',
    };
    
    this.getDataFromProceduresService(formValue);
    }
  
  
   
  
    onSearch():void {
      const data = this.objectParameters();
      this.getDataFromProceduresService(data);
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
  
  
  
  
    /* ------- Meth. Common ------- */
    objectParameters(): PageProceduresData {
      let beginAtETrans = '';

    if(this.beginAtForm?.value === null){
      // this.beginAtE?.setValue(new Date())
       beginAtETrans = '';
    }

    const beginAtTrans = new Date(this.beginAtForm?.value);


    if(this.executionCodeForm?.value === null){
      // this.beginAtE?.setValue(new Date())
      this.executionCodeForm?.setValue(0); 
    }

    if(this.individualNumberPartForm?.value === null){
      // this.beginAtE?.setValue(new Date())
      this.individualNumberPartForm?.setValue(''); 
    }

    const formValue: PageProceduresData =  {
      page: this.page,
      size: this.pageSize,
      beginAt: this.formatDate(beginAtTrans),
      beginAtE: beginAtETrans ? this.formatDate(new Date('13/01/2024')) : '' ,
      executionCode: this.executionCodeForm?.value,
      individualNumber: this.individualNumberPartForm?.value,
    };
    
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
  
  
    /* ------- Meth. Modal load file ------- */
  
  
  
    /* ------- Meth. Services ------- */
    getDataFromProceduresService(data:PageProceduresData) {
      this.proceduresService.getFilterTableEjecutionService(data)
      .subscribe({
        next: (result: any) => {
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
      return this.informationEjecution.get('beginAtForm');
    }
    get beginAtEForm(){
      return this.informationEjecution.get('beginAtEForm');
    }
    get executionCodeForm(){
      return this.informationEjecution.get('executionCodeForm');
    }
    get individualNumberPartForm(){
      return this.informationEjecution.get('individualNumberPartForm');
    }
}
