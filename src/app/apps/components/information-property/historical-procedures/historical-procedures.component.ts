// ANGULAR IMPORTS
import { CdkAccordionModule } from '@angular/cdk/accordion';
import { Component, DestroyRef, inject, Input, OnDestroy, OnInit } from '@angular/core';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { Observable } from 'rxjs';

// ANGULAR MATERIAL IMPORTS
import { MatExpansionModule } from '@angular/material/expansion';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';

// VEX IMPORTS
import { VexLayoutService } from '@vex/services/vex-layout.service';

// CONSTANTS AND ENVIRONMENT IMPORTS
import { PAGE, PAGE_OPTION__10_20_50_100, TYPEINFORMATION_EDITION } from 'src/app/apps/constants/general/constant';
import { environment } from 'src/environments/environments';
import { PAGE_SIZE, TABLE_COLUMN_PROPERTIES_HISTORY } from 'src/app/apps/constants/general/procedures.constant';

// COMPONENT IMPORTS
import {
  HeaderCadastralInformationPropertyComponent
} from '../header-cadastral-information-property/header-cadastral-information-property.component';

// INTERFACES IMPORTS
import { TypeInformation } from 'src/app/apps/interfaces/general/content-info';
import { ProceduresCollection } from 'src/app/apps/interfaces/tables/procedures-progress.model';
import { InformationPegeable } from 'src/app/apps/interfaces/general/information-pegeable.model';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { contentInfoProcedures } from 'src/app/apps/interfaces/general/content-info-procedures.model';
import { PageProceduresData } from 'src/app/apps/interfaces/general/page-procedures-data.model';
import { ProceduresService } from 'src/app/apps/services/general/procedures.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { InputComponent } from '../../general-components/input/input.component';

@Component({
  selector: 'vex-historical-procedures-property',
  standalone: true,
   animations: [
      fadeInRight400ms,
      stagger80ms,
      scaleIn400ms,
      stagger40ms,
      fadeInUp400ms,
      scaleFadeIn400ms
    ],
  imports: [
    MatExpansionModule,
    CdkAccordionModule,
    HeaderCadastralInformationPropertyComponent,


    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    CommonModule,
    MatDatepickerModule,
    NgFor,
    NgClass,
    NgIf,
    InputComponent,
    ReactiveFormsModule
  ],
  templateUrl: './historical-procedures.component.html',
  styleUrl: './historical-procedures.component.scss'
})
export class HistoricalProceduresPropertyComponent implements OnInit, OnDestroy  {

   @Input({ required: true }) id = '';
   @Input({ required: true }) public expandedComponent = true;
   @Input({ required: true }) schema = `${environment.schemas.main}`;
   @Input({ required: true }) baunitId: string | null | undefined = null;
   @Input() editable?: boolean;
   @Input() executionId: string | null | undefined = null;
   @Input() typeInformation: TypeInformation = TYPEINFORMATION_EDITION;

   dataSource!: MatTableDataSource<ProceduresCollection>;
   searchCtrl: UntypedFormControl = new UntypedFormControl();
   isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
   layoutCtrl = new UntypedFormControl('boxed');
   contentInformations!: InformationPegeable;
   private fBuilder = inject(FormBuilder);

   page:number = PAGE;
   pageSize: number = PAGE_SIZE;
   pageSizeOptions: number[] = PAGE_OPTION__10_20_50_100;
   totalElements = 0;
   columns: TableColumn<contentInfoProcedures>[] = TABLE_COLUMN_PROPERTIES_HISTORY;
    private readonly destroyRef: DestroyRef = inject(DestroyRef);

  constructor(
      private readonly layoutService: VexLayoutService,
      private proceduresService: ProceduresService,
       private alertSnakbar: MatSnackBar,
    ) { }

    ngOnInit(): void {
      this.dataSource = new MatTableDataSource();
      console.log('componente');
        this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));
      this.defaultTableData();
    }

    ngOnDestroy() {

    }
  isExpandPanel(expandedComponent: boolean): void {
    if (expandedComponent) {
    }
  }

  public informationDetail(value:any){

        // if(this.urlView != '')

        //   {

        //     this.dialog
        //     .open(DocumentViewerWorkHistoricalComponent, {
        //       minWidth: '370px',
        //       width: '98%',
        //       height: '86%',
        //       disableClose: true,
        //       data: { url: this.urlView}

        //     });







        //   } else {

        //     console.log(value, 'Registro de la tabla');

        //     this.proceduresService.viewDetailIdProcedures(
        //       +value.executionCode)
        //       .subscribe( result => {
        //         this.procedureDetail = result;
        //           this.seeTaskProperty(this.procedureDetail,+value.executionCode);

        //       });

        //   }

  }

  onFilterChange(value: string) {
    if (!this.dataSource) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    this.dataSource.filter = value;
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

  /* ------- Meth. Common ------- */
  objectParameters(): PageProceduresData {

    const formValue: PageProceduresData =  {
      page: this.page,
      size: this.pageSize,
      beginAt:   this.formatDate(this.getOneMonthAgo(new Date())) ,
      beginAtE: this.formatDate(new Date()) ,
      executionCode: '0' ,
      individualNumber:'',
    };

    return formValue;
  }

  getOneMonthAgo(date: Date): Date {
    const result = new Date(date);
    result.setMonth(result.getMonth() - 1);
    return result;
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


    public defaultTableData(){
      const formValue: PageProceduresData =  {
        page: this.page,
        size: this.pageSize,
        beginAt: '13/01/2024',
        beginAtE: '',
        executionCode: '0',
        individualNumber: '',
      };

      this.getDataFromProceduresService(formValue);
      }


     /* ------- Meth. Services ------- */
     getDataFromProceduresService(data:PageProceduresData) {
      this.proceduresService.getFilterTableHistoryService(data)
      .subscribe({
        next: (result: any) => {
            this.captureInformationSubscribe(result);
        },
        error: (error) => {
            this.alertSnakbar.open('Hubo un error, verifique la información de los filtros', 'Close', {
              duration: 10000,
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
