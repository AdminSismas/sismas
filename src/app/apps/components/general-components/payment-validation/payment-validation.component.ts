import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { MatButtonModule } from '@angular/material/button';
import { ProcedureStateTableService } from 'src/app/pages/pages/public-service/ticketOffice/generate-services/service/procedure-state-table.service';
import {
  ProceduresNames,
  SendRequestProcedureData,
  ViewCertificateManagementData
} from 'src/app/apps/interfaces/document-management/view-certificate-management-data.interface';

@Component({
  selector: 'vex-payment-validation',
  standalone: true,
  imports: [
    MatDialogModule,
    MatIconModule,
    MatDividerModule,
    ReactiveFormsModule,
    MatButtonModule
  ],
  templateUrl: './payment-validation.component.html'
})
export class PaymentValidationComponent {  
  /* ---- Properties ---- */
  private fileSelected: File | null = null;

  /* ---- Injects ---- */
  data = inject<ViewCertificateManagementData>(MAT_DIALOG_DATA);
  private fb = inject(FormBuilder);
  private procedureStateTableService = inject(ProcedureStateTableService);
  private dialogRef = inject(MatDialogRef<PaymentValidationComponent>);

  /* ---- Signal ---- */
  currentIcon = signal<string>('mat:verified');
  currentTitle = signal<string>(this.data.title ?? 'Validación de Pago');
  hiddenReference = signal<boolean>(false);
  paymentForm = signal(
    this.fb.group({
      paymentReference: ['', [Validators.required]],
      file: ['', [Validators.required]]
    })
  );

  /* ---- Methods ---- */
  validatePayment() {
    const { paymentReference, file } = this.paymentForm().value;

    if (!paymentReference || !file) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Por favor ingrese el número de referencia y suba un comprobante.',
        showConfirmButton: false,
        timer: 5000
      });
      return;
    }

    if (this.fileSelected === null) return;

    const data: SendRequestProcedureData = {
      paymentReference,
      ...this.data
    };
    
    this.sendRequestProcedure(this.fileSelected, data);
  }

  sendRequestProcedure(file: File, data: SendRequestProcedureData) {
    this.procedureStateTableService
      .sendRequestProcedure(file, data)
      .subscribe((response) => {
        const { templateCode } = this.data;
        const procedureName =
          ProceduresNames[templateCode] ?? '[UNKNOWN PROCEDURE]';
        Swal.fire({
          icon: 'success',
          title: 'Éxito',
          text: `El certificado ${procedureName} ha sido solicitado exitosamente con número de solicitud ${response.requestId}.`,
          showConfirmButton: false,
          timer: 5000
        });

        this.dialogRef.close();
      });
  }

  onFileSelected(event: Event) {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
      const file = input.files[0];
      this.fileSelected = file;
    }
  }
}
