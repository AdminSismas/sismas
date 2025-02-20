import {
  Component,
  OnInit,
  Inject,
  Input,
  SecurityContext
} from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
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
import { environment } from '../../../../../environments/environments';
import { MODEL_METADATA_PROPERTIES } from '../../../constants/general/attachment.constant';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Subscription } from 'rxjs';
import { MatButtonModule } from '@angular/material/button';

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
    MatIconModule,
    MatProgressSpinnerModule,
MatButtonModule,


  ]
})
export class ViewCertificateManagementComponent {

  isLoading: boolean = false;
  errorMessage: string = '';
  isErrorMessage: boolean = false;
  @Input() public id = '';
  showMetadataView = false;
  properties = MODEL_METADATA_PROPERTIES;
  isVerified: boolean = false;
  paymentForm: FormGroup;
  selectedFile: File | null = null;
  currentTitle: string = 'Validación de pago';
  currentIcon: string = 'mat:verified';
  showWarning: boolean = false;
  successMessage: string = '';

  typeCertificate: string;
  documentNumber: string;
  documentType: string;
  fullName: string;
  baunitID: number;


  pdfUrl: SafeResourceUrl | string = '';
  loadSubscription: Subscription | undefined;
  fileType = '';
  fileContent = '';
  basic_url: string | undefined;
  basic_url_appraisals: string | undefined;


  private validReferences = ['123456', '987654', '456789'];

  constructor(
    private sanitizer: DomSanitizer,
    private http: HttpClient,
    public dialogRef: MatDialogRef<ViewCertificateManagementComponent>,
    private fb: FormBuilder,
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
this.paymentForm = this.fb.group({
      reference: [''],
    });

  }

  validatePayment() {
    const reference = this.paymentForm.value.reference;

    if (!reference && !this.selectedFile) {
      this.errorMessage = 'Debes ingresar un número de referencia o subir un comprobante.';
      this.isErrorMessage = true;
      setTimeout(() => (this.errorMessage = ''), 3000);
      return;
    }


    if (this.validReferences.includes(reference) || this.selectedFile) {
      this.errorMessage = 'Validación exitosa.';
      this.isErrorMessage = false;
      this.isVerified = true;


      this.currentTitle = 'Detalles del Certificado';
      this.currentIcon = 'mat:insert_drive_file';


      this.loadPdf();

      setTimeout(() => (this.errorMessage = ''), 3000);
    } else {
      this.errorMessage = 'Número de referencia o comprobante inválido.';
      this.isErrorMessage = true;
      setTimeout(() => (this.errorMessage = ''), 3000);
    }
  }


  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
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
          } else if (this.typeCertificate === 'CERT_PLANO_PREDIAL_CATASTRAL') {
            fileName = `Certificado_plano_predial_catastral_${this.baunitID}.pdf`;
          }

          a.download = fileName;
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
    this.isLoading = true;
    this.errorMessage = '';
    this.isErrorMessage = false;

    const url = this.typeCertificate === 'CERT_POSEER_BIEN_TAQUILLA' ? this.basic_url : this.basic_url_appraisals;
    const queryParams = `?number=${encodeURIComponent(this.documentNumber)}&domIndividualTypeNumber=${encodeURIComponent(this.documentType)}&individualNameNoExist=${encodeURIComponent(this.fullName)}`;
    const fullUrl = `${url}${queryParams}`;

    const token = sessionStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    // Realizar la solicitud HTTP y suscribirse a la respuesta
    this.loadSubscription = this.http.get(fullUrl, { headers, responseType: 'blob' }).subscribe({
      next: (response) => {
        const blob = new Blob([response], { type: 'application/pdf' });
        const blobUrl = URL.createObjectURL(blob);
        this.pdfUrl = this.sanitizer.bypassSecurityTrustResourceUrl(blobUrl);
        this.isLoading = false; // Termina la carga
        this.errorMessage = 'Certificado generado correctamente'; // Mensaje de éxito
        this.isErrorMessage = false; // Mensaje de éxito, color verde

        // Desaparecer el mensaje después de 3 segundos
        setTimeout(() => {
          this.errorMessage = '';
        }, 3000);
      },
      error: (error) => {
        console.error('Error al cargar el documento PDF:', error);
        this.pdfUrl = 'error';
        this.isLoading = false; // Termina la carga
        this.errorMessage = 'Error en generación de certificado'; // Mensaje de error
        this.isErrorMessage = true; // Mensaje de error, color rojo

        // Cerrar el dialog automáticamente si ocurre un error
        setTimeout(() => {
          this.dialogRef.close(); // Cierra el dialog si hay un error
        }, 3000);
      }
    });
  }


  cancelLoad() {
    this.isLoading = false;
    this.errorMessage = '';
    this.loadSubscription?.unsubscribe();
    this.dialogRef.close();
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
