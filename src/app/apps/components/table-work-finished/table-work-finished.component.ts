import { Component, DestroyRef, inject, Input, ViewChild } from '@angular/core';
import { NgFor, NgClass, NgIf, CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { DateAdapter, MAT_DATE_FORMATS } from '@angular/material/core';
import { Observable } from 'rxjs';

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
import { ProcedureWorkFinishedService } from '../../services/procedure-work-finished.service';
@Component({
  selector: 'vex-table-work-finished',
  standalone: true, 
  templateUrl: './table-work-finished.component.html',
  styleUrl: './table-work-finished.component.scss',
  animations: [fadeInUp400ms, stagger40ms],
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
    NgIf
  ],
 
})
export class TableWorkFinishedComponent {
/* ============== ATRIBUTES ============== */
dataSource!: MatTableDataSource<ProceduresCollection>;
searchCtrl: UntypedFormControl = new UntypedFormControl();
isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
layoutCtrl = new UntypedFormControl('boxed');
contentInformations!: InformationPegeable;


beginAt!: Date;
beginAtE!: Date;
executionCode: string = '0';
individualNumber: string = '';
disabledEndDate: boolean = false;

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
    private proceduresService: ProcedureWorkFinishedService,
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
    this.beginAtE = new Date('13/01/2024');
    this.executionCode = '0';
    this.getDataFromProceduresService();
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
  
  
  
  
    /* ------- Meth. Common ------- */
    objectParameters(): PageProceduresData {
      return new PageProceduresData(
        this.page,
        this.pageSize,
        this.formatDate(this.beginAt),
        this.formatDate(this.beginAtE),
        this.executionCode,
        this.individualNumber
      )
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
    getDataFromProceduresService() {
      const data = this.objectParameters();
      this.proceduresService.getDataPropertyByWorkFinishedProcedures(data)
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
  



}
