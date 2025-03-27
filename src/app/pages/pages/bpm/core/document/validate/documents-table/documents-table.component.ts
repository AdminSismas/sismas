import { AfterViewInit, Component, DestroyRef, inject, Input, OnInit, ViewChild } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

// recursos de vex
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { TableColumn } from '@vex/interfaces/table-column.interface';

// recursos de angular material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';

// recursos de archivos locales
import { AttachmentService } from '../../../../../../../apps/services/documnet-management/document-management.service';
import { AttachmentCollection } from '../../../../../../../apps/interfaces/documnet-management/attachment.model';
import { contentInfoAttachment } from '../../../../../../../apps/interfaces/general/content-info-attachment.model';
import { InformationPegeable } from '../../../../../../../apps/interfaces/general/information-pegeable.model';
import { MatDividerModule } from '@angular/material/divider';
import {
  ViewFileDocumentManagementComponent
} from '../../../../../../../apps/components/general-components/view-file-document-management/view-file-document-management.component';
import {
  PAGE,
  PAGE_SIZE,
  PAGE_SIZE_OPTION,
  TABLE_COLUMN_PROPERTIES_DOCUMENT_VALIDATE
} from '../../../../../../../apps/constants/general/attachment.constant';
import { SelectionModel } from '@angular/cdk/collections';
import { MODAL_LARGE } from '../../../../../../../apps/constants/general/constants';


@Component({
  selector: 'vex-documents-table',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatButtonModule,
    MatButtonToggleModule,
    MatCheckboxModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatInputModule,
    MatMenuModule,
    MatPaginatorModule,
    MatSelectModule,
    MatSortModule,
    MatTableModule,
    MatTabsModule,
    MatTooltipModule,
    NgClass,
    NgFor,
    NgIf,
    ReactiveFormsModule,
  ],
  templateUrl: './documents-table.component.html',
  styleUrl: './documents-table.component.scss'
})
export class DocumentsTableComponent implements AfterViewInit, OnInit {

    /* ============== ATRIBUTES ============== */
    numRegister = 0;
    disablePaginator = true;

    layoutCtrl = new UntypedFormControl('boxed');
    searchCtrl: UntypedFormControl = new UntypedFormControl();
    dataSource!: MatTableDataSource<AttachmentCollection>;
    isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
    contentInformations!: InformationPegeable;
    selection = new SelectionModel<AttachmentCollection>(true, []);


    @Input()
    page:number = PAGE;
    pageSize: number = PAGE_SIZE;
    totalElements = 0;
    pageSizeOptions: number[] = PAGE_SIZE_OPTION;
    columns: TableColumn<contentInfoAttachment>[] = TABLE_COLUMN_PROPERTIES_DOCUMENT_VALIDATE;

    @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
    @ViewChild(MatSort, { static: true }) sort?: MatSort;

    @Input() executionId!: string;

    // @Input({ required: true }) public executionId: string = '';


    private readonly destroyRef: DestroyRef = inject(DestroyRef);

    dialogRef!: MatDialogRef<ViewFileDocumentManagementComponent>;


    /* ============== CONSTRUCTOR ============== */
    constructor(
      // @Inject(MAT_DIALOG_DATA) public executionId: any,
      private dialog: MatDialog,
      private attachmentService: AttachmentService,
      private readonly layoutService: VexLayoutService,
    ) {}



    /* ============== METHODS ============== */
    /* ------- Meth. Lifecycle Hooks ------- */
    ngOnInit(): void {
      this.dataSource = new MatTableDataSource();

      this.searchCtrl.valueChanges
        .pipe(takeUntilDestroyed(this.destroyRef))
        .subscribe((value) => this.onFilterChange(value));

      this.getDataFromDocumentManagementService();


    }

    ngAfterViewInit() {
      if (this.paginator) {
        this.dataSource.paginator = this.paginator;
      }

      if (this.sort) {
        this.dataSource.sort = this.sort;
      }
    }


    /* ------- Meth. HTML ------- */
    toggleColumnVisibility(column: TableColumn<contentInfoAttachment>, event: Event) {
      event.stopPropagation();
      event.stopImmediatePropagation();
      column.visible = !column.visible;
    }

    refreshInformationpaginator(event: PageEvent): void {
      if (event == null) {
        return;
      }

      this.page = event.pageIndex;
      this.pageSize = event.pageSize;
    }


    trackByProperty<T>(index: number, column: TableColumn<T>) {
      return column.property;
    }


    get visibleColumns(): string[] {
      return ['action', ...this.columns.filter((c) => c.visible).map((c) => c.property)];
    }



    /* ------- Meth. Common ------- */
    onFilterChange(value: string) {
      if (!this.dataSource) {
        return;
      }
      value = value.trim();
      value = value.toLowerCase();
      //this.dataSource.filter = value;
      this.dataSource.filter = value.trim().toLowerCase();
    }


    viewPaginator(numRegister: number): void {
      if (numRegister < 3) {
        this.disablePaginator = false;
      }
    }



    /* ------- Meth. Modal load file ------- */
    viewFile(metaData: contentInfoAttachment): void {
      this.dialog
        .open(ViewFileDocumentManagementComponent, {
          ...MODAL_LARGE,
          disableClose: true,
          data: {
            metaData: metaData,
            executionId: this.executionId,
          }
        });

        this.dialogRef.afterClosed().subscribe(result => {
        });
      }



    /* ------- Meth. Services ------- */
    getDataFromDocumentManagementService(): void {
      this.attachmentService.getDataPropertyByAttachment(this.executionId).subscribe({
        next: (data: any) => {
          this.dataSource.data = data;
          this.totalElements = data.length;

          this.viewPaginator(data.length);
        },
        error: (error) => {
          console.error('Error al obtener los datos:', error);
        }
      });
    }

    getFileIcon(row: any): string {
      const fileExtension = this.getFileExtension(row.originalFileName);

      switch (fileExtension) {
        case 'pdf':
        case 'txt':
        case 'png':
        case 'jpeg':
        case 'jpg':
        case 'gif':
        case 'bmp':
          return 'mat:visibility';

        case 'doc':
        case 'docx':
        case 'xlsx':
        case 'xls':
        case 'zip':
        case 'rar':
          return 'mat:cloud_download';
        default:
          return 'mat:visibility';
      }
    }

    getMatTooltip(row: any): string {
      const fileExtension = this.getFileExtension(row.originalFileName);

      switch (fileExtension) {
        case 'pdf':
        case 'txt':
        case 'png':
        case 'jpeg':
        case 'jpg':
        case 'gif':
        case 'bmp':
          return 'Ver archivo';

        case 'doc':
        case 'docx':
        case 'xlsx':
        case 'xls':
        case 'zip':
        case 'rar':
          return 'Descargar archivo';

        default:
          return 'Ver archivo';
      }
    }

    getFileTypeIcon(row: any): string {
      const fileExtension = this.getFileExtension(row.originalFileName);
      switch (fileExtension) {
        case 'pdf':
          return 'mat:picture_as_pdf'; // Icono de PDF
        case 'txt':
        case 'doc':
        case 'docx':
        case 'xlsx':
        case 'xls':
          return 'mat:description'; // Icono de documento
        case 'png':
        case 'jpeg':
        case 'jpg':
        case 'gif':
        case 'bmp':
          return 'mat:photo'; // Icono de imagen
        case 'zip':
        case 'rar':
          return 'mat:folder'; // Icono de descarga
        default:
          return 'mat:attachment'; // Icono por defecto
      }
    }

    getFileIconColor(row: any): string {
      const fileExtension = this.getFileExtension(row.originalFileName);

      // Colores para diferentes tipos de archivo
      switch (fileExtension) {
        case 'pdf':
          return 'text-red-600';  // Rojo para PDF
        case 'txt':
        case 'doc':
        case 'docx':
        case 'xlsx':
        case 'xls':
          return 'text-blue-600';  // Azul para documentos
        case 'png':
        case 'jpeg':
        case 'jpg':
        case 'gif':
        case 'bmp':
          return 'text-green-600';  // Verde para imágenes
        case 'zip':
        case 'rar':
          return 'text-yellow-600';  // Amarillo para archivos comprimidos
        default:
          return 'text-gray-600';  // Gris por defecto
      }
    }


    // Función para obtener la extensión del archivo
    getFileExtension(fileName: string): string {
      return fileName.split('.').pop()?.toLowerCase() || '';
    }


    toggleSelection(row: contentInfoAttachment): void {
      this.selection.toggle(row);
    }

    toggleSelectAll(checked: boolean): void {
      if (checked) {
        this.selection.select(...this.dataSource.data);
      } else {
        this.selection.clear();
      }
    }

    isAllSelected(): boolean {
      return this.selection.selected.length === this.dataSource.data.length;
    }

    performActionOnSelected(): void {
      // Aquí puedes realizar cualquier acción con las filas seleccionadas
    }




}
