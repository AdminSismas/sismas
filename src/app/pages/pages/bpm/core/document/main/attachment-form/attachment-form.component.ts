// Angular framework
import { CommonModule } from '@angular/common';
import { Component, EventEmitter, Inject, Output, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';
import { NgxDropzoneModule } from 'ngx-dropzone';
import { SweetAlert2Module, SwalComponent } from '@sweetalert2/ngx-sweetalert2';
// Vex
import { VexPageLayoutComponent } from '@vex/components/vex-page-layout/vex-page-layout.component';
import { VexPageLayoutContentDirective } from '@vex/components/vex-page-layout/vex-page-layout-content.directive';
// Material
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';
import { MatCardModule } from '@angular/material/card';
import { MatDividerModule } from '@angular/material/divider';
import { MatExpansionModule } from '@angular/material/expansion';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatOptionModule } from '@angular/material/core';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSelectModule } from '@angular/material/select';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatSnackBar } from '@angular/material/snack-bar';
import { MatTabsModule } from '@angular/material/tabs';
// Custom
import { AttachmentService } from '../../../../../../../apps/services/bpm/core/document/main/attachment.service';
import { ComboxColletionComponent } from '../../../../../../../apps/components/general-components/combox-colletion/combox-colletion.component';
import { InputComponent } from '../../../../../../../apps/components/general-components/input/input.component';
import Swal from 'sweetalert2';
@Component({
  selector: 'vex-attachment-form',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    NgxDropzoneModule,
    ReactiveFormsModule,
    SweetAlert2Module,
    // Vex
    VexPageLayoutComponent,
    VexPageLayoutContentDirective,
    // Material
    MatButtonModule,
    MatButtonModule,
    MatCardModule,
    MatDialogModule,
    MatDividerModule,
    MatExpansionModule,
    MatFormFieldModule,
    MatIconModule,
    MatIconModule,
    MatInputModule,
    MatOptionModule,
    MatProgressSpinnerModule,
    MatSelectModule,
    MatSlideToggleModule,
    MatTabsModule,
    // Custom
    ComboxColletionComponent,
    InputComponent,

  ],
  templateUrl: './attachment-form.component.html',
  styleUrl: './attachment-form.component.scss'
})
export class AttachmentFormComponent {
  @Output() dataUpdated = new EventEmitter<void>();

  file: File | null = null;
  fileName = '';
  attachmentForm: FormGroup;
  uploadedFiles: File[] = [];
  errorMessage = '';
  isLoading = false;
  isUploading = false;
  uploadTimeout: any;

  @ViewChild('errorForm') errorForm!: SwalComponent;
  @ViewChild('uploadWarning') uploadWarning!: SwalComponent;

  constructor(
    public dialogRef: MatDialogRef<AttachmentFormComponent>,
    private snackbar: MatSnackBar,
    @Inject(MAT_DIALOG_DATA) public data: any,
    private attachmentService: AttachmentService
  ) {
    this.attachmentForm = new FormGroup({
      file: new FormControl(null, Validators.required),
      attachmentType: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
    });
  }

  onSelect(event: any) {
    console.log('event: ', event);

    const maxSize = 50 * 1024 * 1024; // 50MB en bytes

    const alreadySelectedFiles = [];
    const oversizedFiles = [];

    const validFiles = event.addedFiles.filter((nuevoArchivo: File) => {
      const alreadySelected = this.uploadedFiles.some(
        (archivoExistente: File) =>
          archivoExistente.name === nuevoArchivo.name && archivoExistente.size === nuevoArchivo.size
      );

      if (alreadySelected) {
        alreadySelectedFiles.push(nuevoArchivo);
      }

      if (nuevoArchivo.size > maxSize) {
        oversizedFiles.push(nuevoArchivo);
      }

      return !alreadySelected && nuevoArchivo.size <= maxSize;
    });


    if (alreadySelectedFiles.length > 0) {
      this.snackbar.open('Algunos archivos ya han sido seleccionados.', 'OK', { duration: 5000 });
    }

    if (oversizedFiles.length > 0) {
      this.snackbar.open('Algunos archivos exceden el límite de tamaño de 50MB.', 'OK', { duration: 5000 });
    }


    if (validFiles.length > 0) {
      this.uploadedFiles.push(...validFiles);
      this.attachmentForm.patchValue({ file: this.uploadedFiles });
      this.attachmentForm.get('file')?.updateValueAndValidity();
    }
  }


  onRemove(event: any) {
    const index = this.uploadedFiles.indexOf(event);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }

  validateForm(): boolean {
    if (this.attachmentForm.invalid) {
      let errorMessage = 'Por favor complete los siguientes campos:\n';
      if (this.attachmentForm.get('file')?.invalid) errorMessage += '- Archivo\n';
      if (this.attachmentForm.get('attachmentType')?.invalid) errorMessage += '- Tipo de Documento\n';
      if (this.attachmentForm.get('description')?.invalid) errorMessage += '- Descripción\n';

      this.errorMessage = errorMessage;
      this.errorForm.fire();
      return false;
    }
    return true;
  }

  save(): void {
    if (!this.validateForm()) {
      return;
    }

    this.isLoading = true;
    this.isUploading = true;

    const formData = new FormData();
    formData.append('file', this.uploadedFiles[0]);
    formData.append('executionId', this.data.executionId);
    formData.append('taskId', '0');
    formData.append('attachmentType', this.attachmentForm.get('attachmentType')?.value);

    const description = this.attachmentForm.get('description')?.value;
    if (description) {
      formData.append('description', description);
    }


    this.uploadTimeout = setTimeout(() => {
      if (this.isUploading) {
        Swal.fire({
          title: 'El envío está tardando demasiado',
          text: '¿Desea cancelar la operación o continuar esperando?',
          icon: 'warning',
          showCancelButton: true,
          confirmButtonText: 'Continuar esperando',
          cancelButtonText: 'Cancelar operación',
        }).then((result) => {
          if (result.dismiss === Swal.DismissReason.cancel) {
            this.cancelUpload();
          }
        });
      }
    }, 15000);



    this.attachmentService.sendAttachment(formData).subscribe(
      response => {
        clearTimeout(this.uploadTimeout);
        this.snackbar.open('Archivo enviado correctamente', 'OK', { duration: 5000 });
        this.dialogRef.close();
        this.dataUpdated.emit();
        this.isLoading = false;
        this.isUploading = false;
      },
      error => {
        clearTimeout(this.uploadTimeout);
        this.snackbar.open('Error al enviar el archivo', 'OK', { duration: 5000 });
        this.isLoading = false;
        this.isUploading = false;
      }
    );
  }

  cancelUpload() {
    clearTimeout(this.uploadTimeout);
    this.isUploading = false;
    this.isLoading = false;
    this.dialogRef.close();
  }
}
