import { CommonModule, NgFor, NgIf } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Component, Inject, SecurityContext, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatTabsModule } from '@angular/material/tabs';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { MODEL_METADATA_PROPERTIES } from '../../../../../../apps/constants/general/attachment.constant';

@Component({
  selector: 'vex-document-viewer-work-historical',
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
  ],
  templateUrl: './document-viewer-work-historical.component.html',
  styleUrl: './document-viewer-work-historical.component.scss'
})
export class DocumentViewerWorkHistoricalComponent implements OnInit {

  showMetadataView = false;
  properties = MODEL_METADATA_PROPERTIES;

  url: string;
  pdfUrl: SafeResourceUrl | string = '';
  fileType = '';
  fileContent = '';

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    public dialogRef: MatDialogRef<DocumentViewerWorkHistoricalComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      url: string;

    }
  ) {
    this.url = data.url;

  }

  ngOnInit(): void {
    //this.pdfUrl = this.urlPdfViewer();
    //this.loadPdf();
    this.loadPdf();
  }


  downloadPdfFromSafeUrl(): void {
    const unsafeUrl = this.sanitizer.sanitize(SecurityContext.URL, this.pdfUrl);

    if (unsafeUrl) {
      fetch(unsafeUrl)
        .then((res) => res.blob())
        .then((blob) => {
          const blobUrl = window.URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = blobUrl;
          a.download = 'constancia_de_radicacion.pdf';
          document.body.appendChild(a);
          a.click();
          document.body.removeChild(a);

          window.URL.revokeObjectURL(blobUrl);
        })
        .catch((error) =>
          console.error('Error al descargar el archivo:', error)
        );
    } else {
      console.error('URL no segura, descarga cancelada.');
    }
  }



  loadPdf() {
    const token = sessionStorage.getItem('token');
    if (!token) {
      console.error('Token no encontrado. Asegúrate de estar autenticado.');
      return;
    }

    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(this.url, { headers, responseType: 'blob' }).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      },
      error: (error) => {
        console.error('Error al cargar el documento PDF:', error);
        this.pdfUrl = 'error';
      },
    });
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
