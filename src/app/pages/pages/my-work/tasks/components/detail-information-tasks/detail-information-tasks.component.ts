import { AfterViewInit, Component, DestroyRef, inject, Inject, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
// import { INDIVIDUAL_TYPE_NUMBER, NAME_NO_DISPONIBLE } from '../../../../constants/constant';
// import { InfoOwners } from '../../../../interfaces/information-property/info-owners';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { NAME_NO_DISPONIBLE, PAGE_OPTION__5_7_10, PAGE_OPTION_UNIQUE_7, PAGE_SIZE, PAGE_SIZE_OPTION_ADDRESS, PAGE_SIZE_SORT, TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS, TABLE_COLUMN_PROPERTIES_CONSTRUCTIONS_EDITION, TABLE_COLUMN_PROPERTIES_EXECUTED, TYPEINFORMATION_EDITION, TYPEINFORMATION_VISUAL } from 'src/app/apps/constants/constant';
import { MatExpansionModule } from '@angular/material/expansion';
import { CommonModule } from '@angular/common';
import { MatTabsModule } from '@angular/material/tabs';
import { PageSearchData } from 'src/app/apps/interfaces/page-search-data.model';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { BaunitHead } from 'src/app/apps/interfaces/information-property/baunit-head.model';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { DetailExecutedTasksComponent } from './detail-executed-tasks/detail-executed-tasks.component';
import { InformationPegeable } from 'src/app/apps/interfaces/information-pegeable.model';
import { PAGE } from 'src/app/apps/constants/procedures.constant';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { UntypedFormControl } from '@angular/forms';
import { TypeInformation } from 'src/app/apps/interfaces/content-info';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { InformationPropertyService } from 'src/app/apps/services/territorial-organization/information-property.service';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { TaskRetailExecuteResponseModel } from 'src/app/apps/interfaces/task-retail-execute-response.model';
import { ProceduresCollection } from 'src/app/apps/interfaces/procedures-progress.model';
import { TasksPanelService } from 'src/app/apps/services/bpm/tasks-panel.service';
import { TaskResponseModel } from 'src/app/apps/interfaces/task-response.model';

@Component({
  selector: 'vex-detail-information-property-owner',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms,
  ],
  imports: [
    CommonModule,
    MatButtonModule,
    MatDialogClose,
    MatDialogTitle,
    MatDividerModule,
    MatIconModule,
    MatMenuModule,
    MatDialogContent,
    MatExpansionModule,
     MatTabsModule,
     MatCheckboxModule,
     MatPaginatorModule,
     MatTableModule,
     MatSortModule,
  ],
  templateUrl: './detail-information-tasks.component.html'
})
export class DetailInformationTasksComponent implements OnInit, AfterViewInit  {
  
    isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
    contentTasksInformations!: InformationPegeable;
    public taskDetails:TaskResponseModel= new TaskResponseModel();

      @Input({ required: true }) id: string = '';
      @Input({ required: true }) public expandedComponent: boolean = true;
      @Input({ required: true }) schema: string = `${environment.schemas.main}`;
      @Input({ required: true }) baunitId: string | null | undefined = null;
      @Input() executionId: string | null | undefined = null;
      @Input() typeInformation: TypeInformation = TYPEINFORMATION_EDITION;
    
      columns: TableColumn<TaskRetailExecuteResponseModel>[] = TABLE_COLUMN_PROPERTIES_EXECUTED;
      page:number = PAGE;
      totalElements: number = 0;
      pageSize: number = PAGE_OPTION_UNIQUE_7;
      pageSizeOptions: number[] = PAGE_OPTION__5_7_10;
    
      dataSource!: MatTableDataSource<TaskRetailExecuteResponseModel>;
      searchCtrl: UntypedFormControl = new UntypedFormControl();
    
      @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
      @ViewChild(MatSort, { static: true }) sort?: MatSort;
      @ViewChild('confirmDialog', { static: true }) confirmDialog!: TemplateRef<any>;
      
      private readonly destroyRef: DestroyRef = inject(DestroyRef);
      private snackBar = inject(MatSnackBar);

  constructor(
    private tasksPanelService: TasksPanelService,
    public dialogRef: MatDialogRef<DetailInformationTasksComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private dialog: MatDialog,
    private readonly layoutService: VexLayoutService,
    private informationPropertyService: InformationPropertyService
  ) {
  }


  close(): void {
    this.dialogRef.close();
  }

  // implementacion de tabla
  
   
   
  
    ngOnInit() {
      console.log('data nuevo objeto',this.data);
      this.dataSource = new MatTableDataSource();
      // if(this.data.taskExecuteDetail){
      //   this.dataSource = this.data.taskExecuteDetail;
      // }

      if(this.data.taskId){
        this.viewDetallyTask(this.data.taskId);
      }

      if (this.id?.length <= 0 || this.baunitId == null) {
        return;
      }
      this.id = this.id + this.getRandomInt(10000) + this.schema + this.baunitId;
      if(this.typeInformation && this.typeInformation === TYPEINFORMATION_VISUAL) {
        this.pageSize = PAGE_SIZE_SORT;
        this.pageSizeOptions = PAGE_SIZE_OPTION_ADDRESS;
        this.columns = TABLE_COLUMN_PROPERTIES_EXECUTED;
      }
      this.searchCtrl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => this.onFilterChange(value));
    }
    ngAfterViewInit() {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
  
    get visibleColumns() {
      return this.columns
        .filter((column) => column.visible)
        .map((column) => column.property);
    }

    isNegative(value: number): boolean {
      return value < 0;
    }

    getAbsoluteValue(value: number): number {
      return Math.abs(value);
    }
  
    checkNegativeDays(): void {
      if (this.data && this.isNegative(this.data.daysFinish)) {
        console.log('Días negativos:', this.data.daysFinish);
        // Aquí puedes actualizar el valor de los días si es negativo
        this.data.daysFinish = Math.abs(this.data.daysFinish);
      }
    }

    viewDetallyTask(executionId:any){
      this.tasksPanelService.viewTaskId(
        executionId)
        .subscribe( result => {
          this.taskDetails = result;
          console.log('primer servicio',this.taskDetails);
          this.viewExcuteTask(executionId);
        });
    }


    viewExcuteTask(taskId:any){
      this.tasksPanelService.viewExecuteTaskId( this.generateObjectPageSearchData(taskId),taskId)
        .subscribe({
          error: (err: any) => this.captureInformationSubscribeError(err),
          next: (executeTask: InformationPegeable) => {
            console.log('segundo servicio',executeTask);
            this.captureInformationSubscribeB(executeTask);
             }
             });
    }
          
    captureInformationSubscribeB(executeTask: InformationPegeable): void {
        let data: TaskRetailExecuteResponseModel[];
        this.contentTasksInformations = executeTask;
        console.log('executeTask',executeTask.content);

        if (this.contentTasksInformations && this.contentTasksInformations.content) {
          data = this.contentTasksInformations.content;
          data = data.map((row: TaskRetailExecuteResponseModel) => new TaskRetailExecuteResponseModel(row));
          this.dataSource.data = data;
         }

         
          if (this.contentTasksInformations == null) {
              this.page = PAGE;
              return;
          }

          if (this.contentTasksInformations.totalElements) {
              this.totalElements = this.contentTasksInformations.totalElements;
          }

          if (this.contentTasksInformations.pageable == null) {
              this.page = PAGE;
              return;
          }

          if (this.contentTasksInformations.pageable.pageNumber != null) {
              this.page = this.contentTasksInformations.pageable.pageNumber;
          }
        
    }

    captureInformationSubscribeError(err: any): void {
      this.contentTasksInformations = new InformationPegeable();
      this.dataSource.data = [];
    }
  
  
   
    captureInformationConstructionData(): void {
   
      if (this.contentTasksInformations === null) {
        this.page = PAGE;
        return;
      }
  
      if (this.contentTasksInformations.totalElements) {
        this.totalElements = this.contentTasksInformations.totalElements;
      }
  
      if (this.contentTasksInformations.pageable == null) {
        this.page = PAGE;
        return;
      }
  
      if (this.contentTasksInformations.pageable.pageNumber != null) {
        this.page = this.contentTasksInformations.pageable.pageNumber;
      }
    }
  
   
  
    openDetailInTaks(data:TaskRetailExecuteResponseModel){
      this.dialog
        .open(DetailExecutedTasksComponent, {
          minWidth: '40%',
          minHeight: '70%',
          disableClose: true,
          data: data
        })
        .afterClosed();
    }
  
    
    trackByProperty<T>(index: number, column: TableColumn<T>): string {
      return column.property;
    }
  
  
    toggleColumnVisibility(column: TableColumn<BaunitHead>, event: Event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      column.visible = !column.visible;
    }
  
    refreshInformationPaginator(event: PageEvent): void {
      if (event == null) {
        return;
      }
      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
      const  data = this.contentTasksInformations.content.map((row: ProceduresCollection) => new TaskRetailExecuteResponseModel({row}));
      if(this.data.taskId){
        this.viewExcuteTask(this.data.taskId);
      }
     
    }

    captureInformationSubscribe(data: any) {
      this.contentTasksInformations = data; 
      this.captureInformationProceduresData(); 
    }
  

    captureInformationProceduresData() {
          let data: TaskRetailExecuteResponseModel[];
          if (this.contentTasksInformations != null && this.contentTasksInformations.content != null) {
              data = this.contentTasksInformations.content.map((row: ProceduresCollection) => new TaskRetailExecuteResponseModel({row}));
              this.dataSource.data = data;
          }
      
          if (this.contentTasksInformations == null) {
              this.page = PAGE;
              return;
          }
      
          if (this.contentTasksInformations.totalElements) {
              this.totalElements = this.contentTasksInformations.totalElements;
          }
      
          if (this.contentTasksInformations.pageable == null) {
              this.page = PAGE;
              return;
          }
      
          if (this.contentTasksInformations.pageable.pageNumber != null) {
              this.page = this.contentTasksInformations.pageable.pageNumber;
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
  
    private generateObjectPageSearchData(baunitId: string): PageSearchData {
      return new PageSearchData(this.page, this.pageSize, baunitId);
    }
  
    private getRandomInt(max: number): number {
      return Math.floor(Math.random() * max);
    }


  // implementacion de tabla





  protected readonly NAME_NO_DISPONIBLE = NAME_NO_DISPONIBLE;
}
