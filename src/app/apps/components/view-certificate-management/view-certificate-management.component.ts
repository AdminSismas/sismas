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
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'vex-view-certificate-management',
  templateUrl: './view-certificate-management.component.html',
  styleUrl: './view-certificate-management.component.scss',
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
export class ViewCertificateManagementComponent implements OnInit {
  showMetadataView = false;
  properties = MODEL_METADATA_PROPERTIES;

  typeCertificate: string = 'CERT_POSEER_BIEN_TAQUILLA';
  documentNumber: string;
  documentType: string;
  fullName: string;

  basic_url = `${environment.url}:${environment.port}${environment.serviciosTaquilla}${environment.formato}/${this.typeCertificate}${environment.individualNumber}`;
  urlSafe: SafeUrl = '';
  fileType = '';
  fileContent = ''; // Almacenar el contenido del archivo .txt

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    public dialogRef: MatDialogRef<ViewCertificateManagementComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { documentNumber: string; documentType: string; fullName: string }
  ) {
    this.documentNumber = data.documentNumber;
    this.documentType = data.documentType;
    this.fullName = data.fullName;
  }

  ngOnInit(): void {
    //this.urlSafe = this.urlPdfViewer();
    //this.loadPdf();
    this.downloadAndShowPdf();
  
  }

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


  downloadAndShowPdf(): void {
    const queryParams = `?number=${encodeURIComponent(this.data.documentNumber)}&domIndividualTypeNumber=${encodeURIComponent(this.data.documentType)}&individualNameNoExist=${encodeURIComponent(this.data.fullName)}`;
    const fullUrl = `${this.basic_url}${queryParams}`;

    console.log('Cargando PDF desde:', fullUrl);

    // Realiza la solicitud HTTP para obtener el PDF
    this.http.get(fullUrl, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        if (response.type !== 'application/pdf') {
          console.error('El archivo recibido no es un PDF.');
          return;
        }

        // Crea una URL local para el blob
        const blobUrl = window.URL.createObjectURL(response);

        // Muestra el PDF en el `iframe`
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);

        // Descarga el archivo automáticamente
        this.downloadPdf(response);
      },
      error: (err) => {
        console.error('Error al cargar el PDF:', err);
      },
    });
  }

  downloadPdf(blob: Blob): void {
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = blobUrl;
    a.download = 'certificado_no_bien.pdf';
    a.click();

    // Limpia la URL del blob después de la descarga
    window.URL.revokeObjectURL(blobUrl);
  }

  
  loadPdf(): void {
    const queryParams = `?number=${encodeURIComponent(this.data.documentNumber)}&domIndividualTypeNumber=${encodeURIComponent(this.data.documentType)}&individualNameNoExist=${encodeURIComponent(this.data.fullName)}`;
    const fullUrl = `${this.basic_url}${queryParams}`;

    console.log('Cargando PDF desde:', fullUrl);

    // Realiza la solicitud HTTP con el token incluido
    this.http.get(fullUrl, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        if (response.type !== 'application/pdf') {
          console.error('La respuesta no es un PDF válido.');
          return;
        }

        // Genera una URL local para el blob
        const blobUrl = window.URL.createObjectURL(response);
        this.urlSafe = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);

        console.log('PDF cargado y listo para mostrar.');
      },
      error: (err) => {
        console.error('Error al cargar el PDF:', err);
      },
    });
  }

  


  // Método para mostrar el visor de PDF
  urlPdfViewer(): SafeUrl {


    const queryParams = `?number=${encodeURIComponent(this.documentNumber)}&domIndividualTypeNumber=${encodeURIComponent(this.documentType)}&individualNameNoExist=${encodeURIComponent(this.fullName)}`;
    const fullUrl = `${this.basic_url}${queryParams}`;

    console.log('fullUrl', fullUrl);
    return this.sanitizer.bypassSecurityTrustResourceUrl(fullUrl);
  
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
