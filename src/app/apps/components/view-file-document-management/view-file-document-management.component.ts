import { Component, OnInit, Inject } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
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
import { contentInfoAttachment } from 'src/app/apps/interfaces/content-info-attachment.model';
import { environment } from 'src/environments/environments';
import { MODEL_METADATA_PROPERTIES } from '../../constants/attachment.constant';

@Component({
  selector: 'vex-view-file-document-management',
  templateUrl: './view-file-document-management.component.html',
  styleUrl: './view-file-document-management.component.scss',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatIconModule,
    MatDialogModule,
    MatDividerModule,
    MatTabsModule,
    NgFor,
    NgIf,
    MatIconModule
  ]
})
export class ViewFileDocumentManagementComponent implements OnInit {
  showMetadataView = false;
  metadata: contentInfoAttachment;
  properties = MODEL_METADATA_PROPERTIES;

  executionId: string;
  idAttachment: number;
  originalFileName: string;

  basic_url = `${environment.url}:${environment.port}${environment.bpmAttachment.value}`;
  urlSafe: SafeUrl = '';
  fileType = '';
  fileContent = ''; // Almacenar el contenido del archivo .txt

  constructor(
    private sanitizer: DomSanitizer,
    public dialogRef: MatDialogRef<ViewFileDocumentManagementComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: { metaData: contentInfoAttachment; executionId: string }
  ) {
    this.metadata = data.metaData;
    this.idAttachment = this.metadata.id;
    this.originalFileName = this.metadata.originalFileName;
    this.executionId = data.executionId;
  }

  ngOnInit(): void {
    this.urlSafe = this.urlPdfViewer();
    this.fileType = this.getFileType(this.originalFileName);

    if (this.fileType === 'txt') {
      this.loadTextFile();
    }

    if (
      this.fileType === 'xlsx' ||
      this.fileType === 'docx' ||
      this.fileType === 'zip' ||
      this.fileType === 'rar' ||
      this.fileType === 'dwg' ||
      this.fileType === 'shp'
    ) {
      this.downloadFile();
    }
  }

  // Método para identificar el tipo de archivo
  getFileType(fileName: string): string {
    const extension = fileName.split('.').pop()?.toLowerCase();
    if (['pdf'].includes(extension!)) return 'pdf';
    if (['jpg', 'jpeg', 'png', 'bmp', 'tiff', 'gif'].includes(extension!))
      return 'image';
    if (['txt'].includes(extension!)) return 'txt';
    if (['xlsx'].includes(extension!)) return 'xlsx';
    if (['docx'].includes(extension!)) return 'docx';
    if (['zip', 'rar'].includes(extension!)) return 'zip';
    if (['dwg', 'shp'].includes(extension!)) return 'dwg';
    return 'unknown';
  }

  // Método para mostrar el visor de PDF
  urlPdfViewer(): SafeUrl {
    const urlComplete = `${this.basic_url}${this.executionId}/${this.idAttachment}/${this.originalFileName}`;
    alert(urlComplete);
    return this.sanitizer.bypassSecurityTrustResourceUrl(urlComplete);
  }

  // Método para cargar el archivo de texto (.txt)
  loadTextFile(): void {
    const urlComplete = `${this.basic_url}${this.executionId}/${this.idAttachment}/${this.originalFileName}`;
    fetch(urlComplete)
      .then((response) => response.text())
      .then((text) => {
        this.fileContent = text; // Guardamos el contenido del archivo .txt
      })
      .catch((err) =>
        console.error('Error al cargar el archivo de texto', err)
      );
  }
  downloadFile(): void {
    const urlComplete = `${this.basic_url}${this.executionId}/${this.idAttachment}/${this.originalFileName}`;

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
    this.showMetadataView = !this.showMetadataView;
    if (this.showMetadataView) {
      this.dialogRef.updateSize('98%', 'auto');
      this.dialogRef.updatePosition({ top: '5%' });
    } else {
      this.dialogRef.updateSize('98%', '86%');
      this.dialogRef.updatePosition({ top: '5%' });
    }
  }
}
