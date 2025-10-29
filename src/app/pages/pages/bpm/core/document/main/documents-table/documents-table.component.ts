// Angular framework
import { CommonModule, NgClass, NgIf } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  ViewChild
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormControl
} from '@angular/forms';
import { Observable, tap } from 'rxjs';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { SwalComponent, SweetAlert2Module } from '@sweetalert2/ngx-sweetalert2';
// Vex
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { VexLayoutService } from '@vex/services/vex-layout.service';

// Material
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatCheckboxModule } from '@angular/material/checkbox';
import {
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatMenuModule } from '@angular/material/menu';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatSelectModule } from '@angular/material/select';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatTabsModule } from '@angular/material/tabs';
import { MatTooltipModule } from '@angular/material/tooltip';

// Custom
import { AttachmentCollection } from '@shared/interfaces';
import { AttachmentService } from '@features/bpm-workflows/services/attachment.service';
import { contentInfoAttachment } from '@shared/interfaces';
import { InformationPegeable } from '@shared/interfaces';
import { MatDividerModule } from '@angular/material/divider';
import { ViewFileDocumentManagementComponent } from 'src/app/apps/components/general-components/view-file-document-management/view-file-document-management.component';
import {PAGE,
PAGE_SIZE,
PAGE_SIZE_OPTION} from '../../../../../../../apps/constants/general/constants';
import {
  TABLE_COLUMN_ATTACHMENT
} from '../../../../../../../features/bpm-workflows/constants/attachment.constant';
import { AttachmentFormComponent } from '../attachment-form/attachment-form.component';
import { MODAL_LARGE } from '../../../../../../../apps/constants/general/constants';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-documents-main-table',
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
    CommonModule,
    FormsModule,
    NgClass,
    NgIf,
    ReactiveFormsModule,
    SweetAlert2Module,
    // Vex
    // Material
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
    MatTooltipModule
    // Custom
  ],
  templateUrl: './documents-table.component.html',
  styleUrl: './documents-table.component.scss'
})
export class DocumentsMainTableComponent implements AfterViewInit, OnInit {
  // Injects
  private destroyRef: DestroyRef = inject(DestroyRef);
  private attachmentService: AttachmentService = inject(AttachmentService);
  private layoutService: VexLayoutService = inject(VexLayoutService);
  private dialog: MatDialog = inject(MatDialog);

  /* ============== ATRIBUTES ============== */
  numRegister = 0;
  disablePaginator = true;

  layoutCtrl = new UntypedFormControl('boxed');
  searchCtrl: UntypedFormControl = new UntypedFormControl();
  dataSource!: MatTableDataSource<AttachmentCollection>;
  isNotDesktop$: Observable<boolean> = this.layoutService.isDesktop$.pipe(
    tap((response) => !response)
  );
  contentInformations!: InformationPegeable;

  @Input()
  page: number = PAGE;
  pageSize: number = PAGE_SIZE;
  totalElements = 0;
  pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  columns: TableColumn<contentInfoAttachment>[] = TABLE_COLUMN_ATTACHMENT;

  @ViewChild(MatPaginator, { static: false }) paginator?: MatPaginator;
  @ViewChild(MatSort, { static: true }) sort?: MatSort;
  @ViewChild('confirmDialog') confirmDialog!: SwalComponent;

  @Input() executionId!: string;

  // @Input({ required: true }) public executionId: string = '';

  dialogRef!: MatDialogRef<ViewFileDocumentManagementComponent>;

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
  toggleColumnVisibility(
    column: TableColumn<contentInfoAttachment>,
    event: Event
  ) {
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
    return [
      'action',
      ...this.columns.filter((c) => c.visible).map((c) => c.property),
      'delete'
    ];
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
    this.dialog.open(ViewFileDocumentManagementComponent, {
      ...MODAL_LARGE,
      disableClose: true,
      data: {
        metaData: metaData,
        executionId: this.executionId
      }
    });
  }

  /* ------- Meth. Services ------- */
  getDataFromDocumentManagementService(): void {
    this.attachmentService
      .getDataPropertyByAttachment(this.executionId)
      .subscribe({
        next: (data) => {
          this.dataSource.data = data;
          this.totalElements = data.length;

          this.viewPaginator(data.length);
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
        return 'text-red-600'; // Rojo para PDF
      case 'txt':
      case 'doc':
      case 'docx':
      case 'xlsx':
      case 'xls':
        return 'text-blue-600'; // Azul para documentos
      case 'png':
      case 'jpeg':
      case 'jpg':
      case 'gif':
      case 'bmp':
        return 'text-green-600'; // Verde para imágenes
      case 'zip':
      case 'rar':
        return 'text-yellow-600'; // Amarillo para archivos comprimidos
      default:
        return 'text-gray-600'; // Gris por defecto
    }
  }

  onClickOpenAddAttachmentModal(): void {
    const dialogRef = this.dialog.open(AttachmentFormComponent, {
      ...MODAL_LARGE,
      disableClose: true,
      data: { executionId: this.executionId }
    });

    dialogRef.componentInstance.dataUpdated.subscribe(() => {
      this.getDataFromDocumentManagementService();
    });
  }

  onDelete(row: AttachmentCollection): void {
    // Muestra la alerta de confirmación de eliminación
    this.confirmDialog.fire().then((result) => {
      if (result.isConfirmed) {
        this.deleteFile(row);
      }
    });
  }

  deleteFile(row: AttachmentCollection): void {
    const index = this.dataSource.data.findIndex((item) => item.id === row.id);

    if (index !== -1) {
      this.dataSource.data.splice(index, 1);
      this.dataSource._updateChangeSubscription();

      this.attachmentService
        .deleteAttachment(this.executionId, `${row.id}`, row.originalFileName!)
        .subscribe({
          next: () => {
            Swal.fire({
              text: 'Archivo eliminado con éxito',
              icon: 'success',
              confirmButtonColor: '#3085d6',
              confirmButtonText: 'Aceptar',
              timer: 5000
            });
          }
        });
    }
  }
  getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }
}
