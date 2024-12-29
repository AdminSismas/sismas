import { Component, DestroyRef, Inject, inject, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

// recursos de vex
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms } from '@vex/animations/stagger.animation';

// recursos de angular material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule, PageEvent } from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef  } from '@angular/material/dialog';
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
import { AttachmentService } from 'src/app/apps/services/document-management.service';
import { AttachmentCollection } from 'src/app/apps/interfaces/attachment.model';
import { contentInfoAttachment } from 'src/app/apps/interfaces/content-info-attachment.model';
import { InformationPegeable } from 'src/app/apps/interfaces/information-pegeable.model';
import { MatDividerModule } from '@angular/material/divider';
import { ViewFileDocumentManagementComponent } from 'src/app/apps/components/view-file-document-management/view-file-document-management.component';


import { PAGE, PAGE_SIZE, PAGE_SIZE_OPTION, TABLE_COLUMN_PROPERTIES, TABLE_COLUMN_PROPERTIES_DOCUMENT_VALIDATE } from 'src/app/apps/constants/attachment.constant';
import { SelectionModel } from '@angular/cdk/collections';
import { DocumentMainComponent } from '../document-main.component';
import { AttachmentFormComponent } from '../attachment-form/attachment-form.component';
import Swal from 'sweetalert2';
import { MatSnackBar } from '@angular/material/snack-bar';


@Component({
  selector: 'vex-documents-main-table',
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
    DocumentMainComponent
    
  ],
  templateUrl: './documents-table.component.html',
  styleUrl: './documents-table.component.scss'
})
export class DocumentsMainTableComponent implements AfterViewInit, OnInit {

    /* ============== ATRIBUTES ============== */
    numRegister = 0;
    disablePaginator = true;
  
    layoutCtrl = new UntypedFormControl('boxed');
    searchCtrl: UntypedFormControl = new UntypedFormControl();
    dataSource!: MatTableDataSource<AttachmentCollection>;
    isDesktop$: Observable<boolean> = this.layoutService.isDesktop$;
    contentInformations!: InformationPegeable;
   
  

    @Input()
    page:number = PAGE;
    pageSize: number = PAGE_SIZE;
    totalElements = 0;
    pageSizeOptions: number[] = PAGE_SIZE_OPTION;
    columns: TableColumn<contentInfoAttachment>[] = TABLE_COLUMN_PROPERTIES;
  
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
      private snackBar: MatSnackBar,
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
      return ['action', ...this.columns.filter((c) => c.visible).map((c) => c.property),  'delete'];
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
          minWidth:'370px',
          width:'98%',
          height: '86%',
          disableClose: true,
          data: {
            metaData: metaData,
            executionId: this.executionId,
          }
        });
  
        this.dialogRef.afterClosed().subscribe(result => {
          console.log('The dialog was closed');
        });
      }
  
  
  
    /* ------- Meth. Services ------- */
    getDataFromDocumentManagementService(): void {
      this.attachmentService.getDataPropertyByAttachment(this.executionId).subscribe({
        next: (data: any) => {
          console.log("Datos recibidos de la API1 prueba:", data);
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
  

  

    onClickOpenAddAttachmentModal(): void {
      const dialogRef = this.dialog.open(AttachmentFormComponent, {
        minWidth: '370px',
        width: '98%',
        height: '86%',
        disableClose: true,
        data: { executionId: this.executionId }
      });
  
 
      dialogRef.componentInstance.dataUpdated.subscribe(() => {
        console.log('Evento recibido, actualizando datos...');
        this.getDataFromDocumentManagementService(); 
      });
    }

    onDelete(row: any): void {
      // Muestra la alerta de confirmación de eliminación
      Swal.fire({
        title: '¿Estás seguro?',
        text: 'Esta acción no se puede deshacer',
        icon: 'warning',
        showCancelButton: true,
        confirmButtonText: 'Sí, eliminar',
        cancelButtonText: 'Cancelar',
        confirmButtonColor: '#d33',
        cancelButtonColor: '#3085d6',
   
      }).then((result) => {
        if (result.isConfirmed) {
        
          this.deleteFile(row);
        }
      });
    }
  

    deleteFile(row: any): void {
      const index = this.dataSource.data.findIndex(item => item.id === row.id);
      
      if (index !== -1) {
        this.dataSource.data.splice(index, 1);
        this.dataSource._updateChangeSubscription();
    
        this.attachmentService.deleteAttachment(this.executionId, row.id, row.originalFileName).subscribe({
          next: (response) => {
            console.log('Archivo eliminado con éxito:', response);
            this.snackBar.open('Archivo eliminado con éxito', 'Cerrar', {
              duration: 3000, 
              panelClass: ['snack-success'],  
            });
          },
          error: (error) => {
            console.error('Error al eliminar el archivo:', error);
            this.snackBar.open('Hubo un error al eliminar el archivo. Intente nuevamente.', 'Cerrar', {
              duration: 5000,  
              panelClass: ['snack-error'], 
            });
          }
        });
      }
    }
    getFileExtension(fileName: string): string {
      return fileName.split('.').pop()?.toLowerCase() || '';
    }
  
  
}
