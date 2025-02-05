import {
  Component,
  OnInit,
  Inject,
  Input,
  SecurityContext
} from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import {
  DomSanitizer,
  SafeResourceUrl,
  SafeUrl
} from '@angular/platform-browser';

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
import { environment } from 'src/environments/environments';
import { MODEL_METADATA_PROPERTIES } from '../../constants/attachment.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';

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
  @Input() public id = '';
  showMetadataView = false;
  properties = MODEL_METADATA_PROPERTIES;

  typeCertificate: string;
  documentNumber: string;
  documentType: string;
  fullName: string;
  baunitID: number;

 
  pdfUrl: SafeResourceUrl | string = '';
  fileType = '';
  fileContent = '';
  basic_url: string | undefined;
  basic_url_appraisals: string | undefined;

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    public dialogRef: MatDialogRef<ViewCertificateManagementComponent>,
    @Inject(MAT_DIALOG_DATA)
    public data: {
      documentNumber: string;
      documentType: string;
      fullName: string;
      typeCertificate: string;
      baunitID: number;
    }
  ) {
    this.documentNumber = data.documentNumber;
    this.documentType = data.documentType;
    this.fullName = data.fullName ? data.fullName.toUpperCase() : '';
    this.typeCertificate = data.typeCertificate;
    this.baunitID = data.baunitID

    if (this.typeCertificate === 'CERT_POSEER_BIEN_TAQUILLA') {
      this.basic_url = `${environment.url}:${environment.port}${environment.serviciosTaquilla}${environment.formato}/${this.typeCertificate}${environment.individualNumber}`;
    } else {
      this.basic_url_appraisals = `${environment.url}:${environment.port}${environment.serviciosTaquilla}${environment.formato}/${this.typeCertificate}/${this.baunitID}`;
    }
  
  }

  ngOnInit(): void {
    //this.pdfUrl = this.urlPdfViewer();
    //this.loadPdf();
    this.loadPdf();
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
    const queryParams = `?number=${encodeURIComponent(this.data.documentNumber)}&domIndividualTypeNumber=${encodeURIComponent(this.data.documentType)}&individualNameNoExist=${encodeURIComponent(this.fullName)}`;
    const fullUrl = `${this.basic_url}${queryParams}`;

    console.log('Cargando PDF desde:', fullUrl);

    this.http.get(fullUrl, { responseType: 'blob' }).subscribe({
      next: (response: Blob) => {
        if (response.type !== 'application/pdf') {
          console.error('El archivo recibido no es un PDF.');
          return;
        }

        const blobUrl = window.URL.createObjectURL(response);

        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);

        this.downloadPdf(response);
      },
      error: (err) => {
        console.error('Error al cargar el PDF:', err);
      }
    });
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
  
      
          let fileName = '';
          if (this.typeCertificate === 'CERT_POSEER_BIEN_TAQUILLA') {
            fileName = `Certificado_de_poseer_o_no_bienes_${this.fullName}.pdf`;
          } else if (this.typeCertificate === 'CERT_FICHA_AVALUO') {
            fileName = `Certificado_de_ficha_de_avaluo_${this.baunitID}.pdf`;
          }
  
          a.download = fileName; // Usar el nombre de archivo definido
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
  
  downloadPdf(blob: Blob): void {
    const blobUrl = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    
  
    let fileName = '';
    if (this.typeCertificate === 'CERT_POSEER_BIEN_TAQUILLA') {
      fileName = `Certificado_de_poseer_o_no_bienes_${this.fullName}.pdf`;
    } else if (this.typeCertificate === 'CERT_FICHA_AVALUO') {
      fileName = `Certificado_de_ficha_de_avaluo_${this.baunitID}.pdf`;
    }
  
    a.href = blobUrl;
    a.download = fileName;
    a.click();
  
    window.URL.revokeObjectURL(blobUrl);
  }

  loadPdf() {
    const url = this.typeCertificate === 'CERT_POSEER_BIEN_TAQUILLA' ? this.basic_url : this.basic_url_appraisals;
    const queryParams = `?number=${encodeURIComponent(this.documentNumber)}&domIndividualTypeNumber=${encodeURIComponent(this.documentType)}&individualNameNoExist=${encodeURIComponent(this.fullName)}`;
    const fullUrl = `${url}${queryParams}`;

    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get(fullUrl, { headers, responseType: 'blob' }).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
      },
      error: (error) => {
        console.error('Error al cargar el documento PDF:', error);
        this.pdfUrl = 'error';
      }
    });
  }

  // loadPdf(): void {
  //   const queryParams = `?number=${encodeURIComponent(this.data.documentNumber)}&domIndividualTypeNumber=${encodeURIComponent(this.data.documentType)}&individualNameNoExist=${encodeURIComponent(this.data.fullName)}`;
  //   const fullUrl = `${this.basic_url}${queryParams}`;

  //   console.log('Cargando PDF desde:', fullUrl);

  //   // Realiza la solicitud HTTP con el token incluido
  //   this.http.get(fullUrl, { responseType: 'blob' }).subscribe({
  //     next: (response: Blob) => {
  //       if (response.type !== 'application/pdf') {
  //         console.error('La respuesta no es un PDF válido.');
  //         return;
  //       }

  //       // Genera una URL local para el blob
  //       const blobUrl = window.URL.createObjectURL(response);
  //       this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);

  //       console.log('PDF cargado y listo para mostrar.');
  //     },
  //     error: (err) => {
  //       console.error('Error al cargar el PDF:', err);
  //     },
  //   });
  // }

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
