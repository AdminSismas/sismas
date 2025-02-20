import { CommonModule } from '@angular/common';
import { Component, Inject } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';

@Component({
  selector: 'vex-proof-of-payment-dialog',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    MatButtonModule,
    CommonModule,
    

    
  ],
  templateUrl: './proof-of-payment-dialog.component.html',
  styleUrl: './proof-of-payment-dialog.component.scss'
})
export class ProofOfPaymentDialogComponent {
  paymentForm: FormGroup;
  selectedFile: File | null = null;

  // Datos predefinidos para validar
  private validReferences = ['123456', '987654', '456789'];

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProofOfPaymentDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: any
  ) {
    this.paymentForm = this.fb.group({
      reference: ['', [Validators.required, Validators.minLength(6)]],
      file: [null, Validators.required],
    });
  }

  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];
  }

  submit() {
    const reference = this.paymentForm.value.reference;

    if (this.validReferences.includes(reference)) {
      alert('Referencia válida. Puedes continuar.');
      this.dialogRef.close(true);
    } else {
      alert('Número de referencia inválido.');
    }
  }

  close() {
    this.dialogRef.close(false);
  }

}
