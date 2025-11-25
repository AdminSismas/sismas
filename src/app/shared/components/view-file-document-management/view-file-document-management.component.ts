import {
  Component,
  ChangeDetectionStrategy,
  inject,
  OnInit,
  signal
} from '@angular/core';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';

// recursos de angular material
import { MatIconModule } from '@angular/material/icon';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatTabsModule } from '@angular/material/tabs';

// recursos de archivos locales
import { contentInfoAttachment } from '@features/bpm-workflows/models/document-management/content-info-attachment.model';
import { environment } from '@environments/environments';
import { MODEL_METADATA_PROPERTIES } from '@features/bpm-workflows/constants/documents-table/attachment.constant';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'vex-view-file-document-management',
  templateUrl: './view-file-document-management.component.html',
  styleUrl: './view-file-document-management.component.scss',
  standalone: true,
  imports: [
    DatePipe,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatTabsModule,
    MatIconModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ViewFileDocumentManagementComponent implements OnInit {
  /* ---- Injects ---- */
  private readonly sanitizer = inject(DomSanitizer);
  private readonly dialogRef = inject(
    MatDialogRef<ViewFileDocumentManagementComponent>
  );
  private readonly data = inject<{
    metaData: contentInfoAttachment;
    executionId: string;
  }>(MAT_DIALOG_DATA);

  /* ---- Properties ---- */
  private readonly basic_url = `${environment.url}:${environment.port}${environment.bpmAttachment.value}/`;
  public readonly properties = MODEL_METADATA_PROPERTIES;
  private originalFileName = this.data.metaData.originalFileName;

  /* ---- Signals ---- */
  public readonly showMetadataView = signal<boolean>(false);
  public readonly metadata = signal<contentInfoAttachment>(this.data.metaData);
  public readonly fileType = signal<string>('');
  public readonly urlSafe = signal<SafeUrl>({} as SafeUrl);
  public readonly fileContent = signal<string>(''); // Almacenar el contenido del archivo .txt

  /* ---- Lifecycle ---- */
  ngOnInit(): void {
    this.fileType.set(this.getFileType(this.originalFileName));
    this.urlSafe.set(this.urlPdfViewer());

    if (this.fileType() === 'txt') {
      this.loadTextFile();
    }

    if (
      this.fileType() === 'xlsx' ||
      this.fileType() === 'docx' ||
      this.fileType() === 'zip' ||
      this.fileType() === 'rar' ||
      this.fileType() === 'dwg' ||
      this.fileType() === 'shp' ||
      this.fileType() === 'tiff' ||
      this.fileType() === 'unknown'
    ) {
      this.downloadFile();
    }
  }

  /* ---- Methods ---- */
  // Método para identificar el tipo de archivo
  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension!)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'bmp', 'gif'].includes(extension!))
      return 'image';
    if (['tif', 'tiff'].includes(extension!)) return 'tiff';
    if (['txt'].includes(extension!)) return 'txt';
    if (['xlsx'].includes(extension!)) return 'xlsx';
    if (['docx'].includes(extension!)) return 'docx';
    if (['zip', 'rar'].includes(extension!)) return 'zip';
    if (['dwg', 'shp'].includes(extension!)) return 'dwg';
    return 'unknown';
  }

  // Método para mostrar el visor de PDF
  urlPdfViewer(): SafeUrl {
    const { executionId, idAttachment, originalFileName } = {
      executionId: this.data.executionId,
      idAttachment: this.metadata().id,
      originalFileName: this.originalFileName
    };
    const urlComplete = `${this.basic_url}${executionId}/${idAttachment}/${originalFileName}`;
    return this.sanitizer.bypassSecurityTrustResourceUrl(urlComplete);
  }

  // Método para cargar el archivo de texto (.txt)
  loadTextFile(): void {
    const { executionId, idAttachment, originalFileName } = {
      executionId: this.data.executionId,
      idAttachment: this.metadata().id,
      originalFileName: this.originalFileName
    };
    const urlComplete = `${this.basic_url}${executionId}/${idAttachment}/${originalFileName}`;
    fetch(urlComplete)
      .then((response) => response.text())
      .then((text) => {
        this.fileContent.set(text); // Guardamos el contenido del archivo .txt
      })
      .catch((err) =>
        console.error('Error al cargar el archivo de texto', err)
      );
  }

  downloadFile(): void {
    const { executionId, idAttachment, originalFileName } = {
      executionId: this.data.executionId,
      idAttachment: this.metadata().id,
      originalFileName: this.originalFileName
    };
    const urlComplete = `${this.basic_url}${executionId}/${idAttachment}/${originalFileName}`;

    // Abrir el documento en una nueva pestaña
    const newWindow = window.open(urlComplete, '_blank');

    // Crear un enlace para descargar el archivo
    const a = document.createElement('a');
    a.href = urlComplete;
    a.download = this.originalFileName;

    // Asegurarse de que el enlace se descargue en la nueva pestaña
    if (newWindow) {
      newWindow.onload = () => {
        newWindow.document.body.appendChild(a);
        a.click();
      };
    } else {
      // Si la nueva pestaña no se puede abrir, descargar en la misma ventana
      a.click();
    }
  }

  switchViewDocMetaData(): void {
    this.showMetadataView.update((value) => !value);
    if (this.showMetadataView()) {
      this.dialogRef.updateSize('98%', 'auto');
      this.dialogRef.updatePosition({ top: '5%' });
    } else {
      this.dialogRef.updateSize('98%', '86%');
      this.dialogRef.updatePosition({ top: '5%' });
    }
  }
}
