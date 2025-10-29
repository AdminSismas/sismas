import {
  AfterViewInit,
  Component,
  DestroyRef,
  inject,
  input,
  OnInit,
  signal,
  viewChild
} from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { takeUntilDestroyed, toSignal } from '@angular/core/rxjs-interop';
import { DatePipe, NgClass } from '@angular/common';
import { ChangeDetectionStrategy } from '@angular/core';

// recursos de vex
import { VexLayoutService } from '@vex/services/vex-layout.service';
import { TableColumn } from '@vex/interfaces/table-column.interface';

// recursos de angular material
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import {
  MatPaginator,
  MatPaginatorModule,
  PageEvent
} from '@angular/material/paginator';
import { MatSort, MatSortModule } from '@angular/material/sort';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatMenuModule } from '@angular/material/menu';
import { MatIconModule } from '@angular/material/icon';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { MatInputModule } from '@angular/material/input';
import { MatTabsModule } from '@angular/material/tabs';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';

// Recursos del proyecto
import { AttachmentService } from '@features/bpm-workflows/services/attachment.service';
import { AttachmentCollection } from '@shared/interfaces';
import { contentInfoAttachment } from '@shared/interfaces';
import { ViewFileDocumentManagementComponent } from 'src/app/apps/components/general-components/view-file-document-management/view-file-document-management.component';
import { TABLE_COLUMN_ATTACHMENT_DOCUMENT_VALIDATE } from '@features/bpm-workflows/constants';
import {
  MODAL_LARGE,
  PAGE,
  PAGE_SIZE,
  PAGE_SIZE_OPTION
} from '@shared/constants';

@Component({
  selector: 'vex-documents-table',
  standalone: true,
  host: {
    class: '-mt-2 px-5'
  },
  imports: [
    DatePipe,
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
    ReactiveFormsModule
  ],
  templateUrl: './document-validate.component.html',
  styleUrl: './document-validate.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class DocumentValidateComponent implements AfterViewInit, OnInit {
  /* ---- Injects ---- */
  private readonly dialog: MatDialog = inject(MatDialog);
  private readonly attachmentService: AttachmentService =
    inject(AttachmentService);
  private readonly layoutService: VexLayoutService = inject(VexLayoutService);

  /* ---- Controllers ---- */
  searchCtrl: FormControl = new FormControl();

  /* ---- Inputs ---- */
  public readonly executionId = input.required<string>();
  public readonly mode = input.required<string>();
  public readonly resources = input.required<string[]>();

  /* ---- Signals ---- */
  public readonly dataSource = signal<MatTableDataSource<AttachmentCollection>>(
    new MatTableDataSource()
  );
  public readonly page = signal<number>(PAGE);
  public readonly totalElements = signal<number>(0);
  public readonly pageSize = signal<number>(PAGE_SIZE);
  public readonly isDesktop$ = toSignal(this.layoutService.isDesktop$);
  public readonly disablePaginator = signal<boolean>(true);

  /* ---- Properties ---- */
  public readonly pageSizeOptions: number[] = PAGE_SIZE_OPTION;
  public readonly columns: TableColumn<contentInfoAttachment>[] =
    TABLE_COLUMN_ATTACHMENT_DOCUMENT_VALIDATE;

  /* ---- View Child ---- */
  public readonly paginator? = viewChild.required(MatPaginator);
  public readonly sort? = viewChild.required(MatSort);

  /* ---- Destroy Ref ---- */
  private readonly destroyRef: DestroyRef = inject(DestroyRef);

  /* ============== METHODS ============== */
  /* ------- Meth. Lifecycle Hooks ------- */
  ngOnInit(): void {
    this.searchCtrl.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((value) => this.onFilterChange(value));

    this.getDataFromDocumentManagementService();
  }

  ngAfterViewInit() {
    if (this.paginator) {
      this.dataSource().paginator = this.paginator();
    }

    if (this.sort) {
      this.dataSource().sort = this.sort();
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

    this.page.set(event.pageIndex);
    this.pageSize.set(event.pageSize);
  }

  trackByProperty<T>(index: number, column: TableColumn<T>) {
    return column.property;
  }

  get visibleColumns(): string[] {
    return [
      'action',
      ...this.columns.filter((c) => c.visible).map((c) => c.property)
    ];
  }

  /* ------- Meth. Common ------- */
  onFilterChange(value: string) {
    if (!this.dataSource()) {
      return;
    }
    value = value.trim();
    value = value.toLowerCase();
    //this.dataSource().filter = value;
    this.dataSource().filter = value.trim().toLowerCase();
  }

  viewPaginator(numRegister: number): void {
    if (numRegister < 3) {
      this.disablePaginator.set(false);
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
      .getDataPropertyByAttachment(this.executionId())
      .subscribe({
        next: (data) => {
          this.dataSource().data = data;
          this.totalElements.set(data.length);

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

  // Función para obtener la extensión del archivo
  getFileExtension(fileName: string): string {
    return fileName.split('.').pop()?.toLowerCase() || '';
  }
}
