import { Component, DestroyRef, inject, Input, TemplateRef, ViewChild } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { VexBreadcrumbsComponent } from '@vex/components/vex-breadcrumbs/vex-breadcrumbs.component';
import { VexSecondaryToolbarComponent } from '@vex/components/vex-secondary-toolbar/vex-secondary-toolbar.component';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { CommonModule, NgClass, NgFor, NgIf, NgTemplateOutlet } from '@angular/common';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatButtonModule } from '@angular/material/button';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatMenuModule } from '@angular/material/menu';
import { MatInputModule } from '@angular/material/input';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';

import { PageSearchData } from '../../../../../apps/interfaces/general/page-search-data.model';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { OutFormatModel } from '../../../../../apps/interfaces/general/out-format.model';
import { InformationPegeable } from '../../../../../apps/interfaces/general/information-pegeable.model';
import {
  MODAL_SMALL,
  PAGE,
  PAGE_OPTION__10_20_50_100,
  PAGE_SIZE,
  PAGE_SIZE_OPTION_ADDRESS,
  PAGE_SIZE_SORT,
  TABLE_COLUMN_DOCUMENT_ASSOCIATION,
  TYPE_INFORMATION_EDITION,
  TYPE_INFORMATION_VISUAL
} from '../../../../../apps/constants/general/constant';
import { UserService } from '../../../auth/login/services/user.service';

import { VexLayoutService } from '@vex/services/vex-layout.service';
import { MatSnackBar } from '@angular/material/snack-bar';

import { DecodeJwt } from 'src/app/apps/interfaces/user-details/user.model';
import { TypeInformation } from '../../../../../apps/interfaces/general/content-info';
import { environment } from 'src/environments/environments';
import { Observable } from 'rxjs';
import { OutFormatService } from '../../../../../apps/services/general/out-format.service';
import { OutputFormatsEditUpdateComponent } from './output-formats-edit-update/output-formats-edit-update.component';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';

export interface AddOutputFormats {
  type: 'edit' | 'new';
  documentAssociated: OutFormatModel | undefined;
  outTemplateId: number | undefined;
}



@Component({
  selector: 'vex-output-formats',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    MatIconModule,
    VexBreadcrumbsComponent,
    VexSecondaryToolbarComponent,
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    MatTableModule,
    SweetAlert2Module,
    MatInputModule,
    MatIconModule,
    MatMenuModule,
    ReactiveFormsModule,
    MatPaginatorModule,
    MatDatepickerModule,
    MatCheckboxModule,
    MatButtonModule,
    MatIconModule,
    MatSortModule,
    MatTableModule,
    NgFor,
    NgClass,
    NgIf,
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    MatDialogModule
  ],
  templateUrl: './output-formats.component.html',
  styleUrl: './output-formats.component.scss'
})
export class OutputFormatsComponent {
isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
    contentInformations!: InformationPegeable;

    // @Input({ required: true }) id = '';
    // @Input({ required: true }) public expandedComponent = true;
    @Input({ required: true }) schema = `${environment.schemas.main}`;
    @Input({ required: true }) outTempplateId: number | null | undefined = null;
    @Input() executionId: string | null | undefined = null;
    @Input() typeInformation: TypeInformation = TYPE_INFORMATION_EDITION;

    @ViewChild('deleteSwal') private deleteSwal!: SwalComponent;
    @ViewChild('errorSwal') private errorSwal!: SwalComponent;

    columns: TableColumn<OutFormatModel>[] = TABLE_COLUMN_DOCUMENT_ASSOCIATION;
    page:number = PAGE;
    totalElements = 0;
    pageSize: number = PAGE_SIZE;
    pageSizeOptions: number[] = PAGE_OPTION__10_20_50_100;
    userSesion:DecodeJwt | null = null;

    dataSource!: MatTableDataSource<OutFormatModel>;
    searchCtrl: UntypedFormControl = new UntypedFormControl();

    @ViewChild(MatPaginator, { read: true }) paginator?: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort?: MatSort;
    @ViewChild('confirmDialog', { static: true }) confirmDialog!: TemplateRef<NgTemplateOutlet >;

    private readonly destroyRef: DestroyRef = inject(DestroyRef);
    private snackBar = inject(MatSnackBar);
    constructor(
      private dialog: MatDialog,
      private readonly layoutService: VexLayoutService,
      private outFormatService: OutFormatService,
      private userService:UserService
    ) {
    }

    ngOnInit() {
      console.log('ngOnInit');
      this.dataSource = new MatTableDataSource();
      // if (this.id?.length <= 0 || this.baunitId == null) {
      //   return;
      // }
      // this.id = this.id + this.getRandomInt(10000) + this.schema + this.outTempplateId;
      if(this.typeInformation && this.typeInformation === TYPE_INFORMATION_VISUAL) {
        this.pageSize = PAGE_SIZE_SORT;
        this.pageSizeOptions = PAGE_SIZE_OPTION_ADDRESS;
        this.columns = TABLE_COLUMN_DOCUMENT_ASSOCIATION;
      }
      this.searchDocumentoList();
    }
    ngAfterViewInit() {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }
      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }
    public getUserSession(){
      this.userSesion = this.userService.getUser();
    }

    get visibleColumns() {
      return this.columns
        .filter((column) => column.visible)
        .map((column) => column.property);
    }



    searchDocumentoList(): boolean {
      this.outFormatService.getDataDocumentoAsociety(
        this.generateObjectPageSearchData(''))
        .subscribe({
          error: (err: any) => this.captureInformationSubscribeError(err),
          next: (result: InformationPegeable) => this.captureInformationSubscribe(result)
        });
      return true;
    }

    captureInformationSubscribe(result: InformationPegeable): void {
      this.contentInformations = result;
      console.log('contentInformations', this.contentInformations);
      this.captureInformationConstructionData();
    }

    captureInformationConstructionData(): void {
      let data: OutFormatModel[];
      if (this.contentInformations && this.contentInformations.content) {
        data = this.contentInformations.content;
        data = data.map((row: OutFormatModel) => new OutFormatModel(row));
        this.dataSource.data = data;
      }

      if (this.contentInformations === null) {
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

    captureInformationSubscribeError(err: any): void {
      this.contentInformations = new InformationPegeable();
      this.dataSource.data = [];
    }


    trackByProperty<T>(index: number, column: TableColumn<T>): string {
      return column.property;
    }


    createEditDocumentTemplate(
      data?: OutFormatModel
    ): void {

      const dialogData: AddOutputFormats = {
        type: data ? 'edit' : 'new',
        documentAssociated: data ? new OutFormatModel(data, this.schema) : undefined,
        outTemplateId: data?.outTemplateId || this.outTempplateId || undefined,
      };
      console.log('data', data);

      const dialogRef = this.dialog.open(OutputFormatsEditUpdateComponent, {
        ...MODAL_SMALL,
        disableClose: true,
        data: dialogData
      });

      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          console.log('RESPUESTA DEL CREAR O ACTUALIZAR', result);
          console.log('TIPO PROCESOS', dialogData.type);
          console.log('documentAssociated', dialogData.documentAssociated);


          if(dialogData.type === 'new'){
            this.saveDocumento(result);
          }else{
            this.updateDocumento(result);
          }

        }
      });
    }

    saveDocumento(data:any): boolean {
      this.outFormatService.setDataDocumentoAsocietySave(
        this.generateObjectPageSearchData(''),data)
        .subscribe({
          error: (err: any) => this.captureInformationSubscribeError(err),
          next: (result: InformationPegeable) => this.searchDocumentoList()
        });
      return true;
    }

    updateDocumento(data:any): boolean {
      this.outFormatService.setUDocumentoAsocietyUpdate(
        this.generateObjectPageSearchData(data?.outTemplateId),data)
        .subscribe({
          error: (err: any) => this.captureInformationSubscribeError(err),
          next: (result: InformationPegeable) => this.searchDocumentoList()
        });
      return true;
    }

    editInformations(valueTemplate: any): void {
      console.log('valueTemplate valor de la tabla', valueTemplate);
      // const dialogRef = this.dialog.open(DocumentAssociatedEditUpdateComponent, {
      //   width: '58%',
      //   height: '80%',
      //   disableClose: true,
      //   data: {
      //     ...valueTemplate
      //   }
      // });

      // dialogRef.afterClosed().subscribe((result) => {
      //   if (result) {
      //     console.log('result', result);
      //   }
      // });
    }

    deleteInformations(customer: any): void {
      const dialogRef = this.dialog.open(this.confirmDialog);
      dialogRef.afterClosed().subscribe((result) => {
        if (result) {
          const outTemplateId = customer.outTemplateId ?? '';

          this.outFormatService.setUDocumentoAsocietyDelete(outTemplateId).subscribe({
            next: () => {
              this.searchDocumentoList();
              this.deleteSwal.fire();
            },
            error: () => {
              this.errorSwal.fire();
            }
          });
        }
      });
    }




    toggleColumnVisibility(column: TableColumn<OutFormatModel>, event: Event) {
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

      const validate: boolean = this.searchDocumentoList();
      if (!validate) {
        throw new Error('No fue posible actualizar los datos de la tabla');
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

    private generateObjectPageSearchData(outTemplateId: string): PageSearchData {
      return new PageSearchData(this.page, this.pageSize, outTemplateId);
    }

    private getRandomInt(max: number): number {
      return Math.floor(Math.random() * max);
    }
}
