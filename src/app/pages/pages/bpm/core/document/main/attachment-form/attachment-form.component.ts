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
import { AttachmentService } from '../service/attachment.service';
import { ComboxColletionComponent } from 'src/app/apps/components/combox-colletion/combox-colletion.component';
import { InputComponent } from 'src/app/apps/components/input/input.component';
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
  errorMessage= '';
  @ViewChild('errorForm') errorForm!: SwalComponent;

  constructor(public dialogRef: MatDialogRef<AttachmentFormComponent>, private snackbar: MatSnackBar,  @Inject(MAT_DIALOG_DATA) public data: any , private attachmentService: AttachmentService) {

    this.attachmentForm = new FormGroup({
      file: new FormControl(null, Validators.required),
      attachmentType: new FormControl(null, Validators.required),
      description: new FormControl(null, Validators.required),
    });
  }

  onSelect(event: any) {
    console.log('event: ', event);

    const file = event.addedFiles.filter((nuevoArchivo: File) => {

      return !this.uploadedFiles.some((archivoExistente: File) =>
        archivoExistente.name === nuevoArchivo.name && archivoExistente.size === nuevoArchivo.size
      );
    });

    if (file.length < event.addedFiles.length) {

      console.warn('Algunos archivos ya han sido seleccionados anteriormente.');
      this.snackbar.open('Algunos archivos ya están seleccionados.', 'OK', { duration: 10000 });
    }
    this.uploadedFiles.push(...file);
    this.attachmentForm .patchValue({
      file: this.uploadedFiles
    });
    this.attachmentForm .get('file')?.updateValueAndValidity();
  }

  onRemove(event: any) {
    console.log('event: ', event);
    const index = this.uploadedFiles.indexOf(event);
    if (index > -1) {
      this.uploadedFiles.splice(index, 1);
    }
  }

  // Validación de formulario
  validateForm(): boolean {
    if (this.attachmentForm.invalid) {
      let errorMessage = 'Por favor complete los siguientes campos:\n';

      // Revisar cada campo obligatorio y añadir el error a la lista
      if (this.attachmentForm.get('file')?.invalid) {
        errorMessage += '- Archivo\n';
      }
      if (this.attachmentForm.get('attachmentType')?.invalid) {
        errorMessage += '- Tipo de Documento\n';
      }
      if (this.attachmentForm.get('description')?.invalid) {
        errorMessage += '- Descripción\n';
      }
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

    const formData = new FormData();
    formData.append('file', this.uploadedFiles[0]);
    formData.append('executionId', this.data.executionId);
    formData.append('taskId', '0');
    formData.append('attachmentType', this.attachmentForm.get('attachmentType')?.value);


    const description = this.attachmentForm.get('description')?.value;
    if (description) {
      formData.append('description', description);
    }


    this.attachmentService.sendAttachment(formData).subscribe(
      response => {
        console.log('Respuesta de la API:', response);

        this.snackbar.open('Archivo enviado correctamente', 'OK', { duration: 10000 });
        this.dialogRef.close();
        this.dataUpdated.emit();
      },
      error => {
        console.error('Error en la solicitud:', error);
        this.snackbar.open('Error al enviar el archivo', 'OK', { duration: 10000 });
      }
    );
  }


}
