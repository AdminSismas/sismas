import { Component, DestroyRef, Inject, inject, Input, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormControl } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, NgClass, NgFor, NgIf } from '@angular/common';
import { Observable } from 'rxjs';

// recursos de vex
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
import { AttachmentService } from '../../../services/documnet-management/document-management.service';
import { AttachmentCollection } from '../../../interfaces/documnet-management/attachment.model';
import { contentInfoAttachment } from '../../../interfaces/general/content-info-attachment.model';
import { InformationPegeable } from '../../../interfaces/general/information-pegeable.model';
import { ViewFileDocumentManagementComponent } from '../../general-components/view-file-document-management/view-file-document-management.component';
import { PAGE, PAGE_SIZE, PAGE_SIZE_OPTION, TABLE_COLUMN_PROPERTIES } from '../../../constants/general/attachment.constant';
import { MODAL_LARGE } from '../../../constants/general/constant';
import { MatDividerModule } from '@angular/material/divider';
import { CurrencyLandsPipe } from 'src/app/apps/pipes/currency-lands.pipe';
import { AttachmentFormComponent } from 'src/app/pages/pages/bpm/core/document/main/attachment-form/attachment-form.component';



@Component({
  templateUrl: './document-table.component.html',
  styleUrl: './document-table.component.css',
  selector: 'vex-document-management',
  standalone: true,
  animations: [fadeInUp400ms, stagger40ms],
  imports: [
    CurrencyLandsPipe,
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
  ]
})
export class DocumentTableComponent implements OnInit, AfterViewInit {
  /* ============== ATTRIBUTES ============== */
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


  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  dialogRef!: MatDialogRef<ViewFileDocumentManagementComponent>;


  /* ============== CONSTRUCTOR ============== */
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { executionId: string },
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

  newFolder(value:any): void {
        const dialogRef = this.dialog.open(AttachmentFormComponent, {
          ...MODAL_LARGE,
          disableClose: true,
          data: { executionId: this.data.executionId }
        });
  
  
        dialogRef.componentInstance.dataUpdated.subscribe(() => {
          console.log('Evento recibido, actualizando datos...');
          this.getDataFromDocumentManagementService();
        });
  }

  /* ------- Meth. HTML ------- */
  toggleColumnVisibility(column: TableColumn<contentInfoAttachment>, event: Event) {
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
          executionId: this.data.executionId,
        }
      });

    this.dialogRef.afterClosed().subscribe(() => {
      console.log('The dialog was closed');
    });
  }



  /* ------- Meth. Services ------- */
  getDataFromDocumentManagementService(): void {
    this.attachmentService.getDataPropertyByAttachment(this.data.executionId).subscribe({
      next: (data: AttachmentCollection[]) => {
        console.log("Datos recibidos de la API1:", data);
        this.dataSource.data = data;
        this.totalElements = data.length;

        this.viewPaginator(data.length);
      },
      error: (error) => {
        console.error('Error al obtener los datos:', error);
      }
    });
  }

  getFileIcon(row: AttachmentCollection): string {
    const fileExtension = this.getFileExtension(row.originalFileName!);

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

  getMatTooltip(row: AttachmentCollection): string {
    const fileExtension = this.getFileExtension(row.originalFileName!);

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

  getFileTypeIcon(row: AttachmentCollection): string {
    const fileExtension = this.getFileExtension(row.originalFileName!);
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

  getFileIconColor(row: AttachmentCollection): string {
    const fileExtension = this.getFileExtension(row.originalFileName!);

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


}


