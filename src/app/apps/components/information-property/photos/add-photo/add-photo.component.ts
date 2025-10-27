import { Component, inject, signal } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DynamicFormsComponent } from 'src/app/apps/components/forms/dynamic-forms/dynamic-forms.component';import { FormGroup } from '@angular/forms';
import { inputsAddPhotos } from 'src/app/apps/constants/general/photos.constant';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-add-photo',
  standalone: true,
  imports: [
    MatDialogModule,
    MatButtonModule,
    MatIconModule,
    MatDividerModule,
    DynamicFormsComponent
  ],
  templateUrl: './add-photo.component.html'
})
export class AddPhotoComponent {
  data = inject(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<AddPhotoComponent>);

  form = signal<FormGroup>(new FormGroup({}));

  protected readonly inputs = inputsAddPhotos;

  uploadingFoto() {
    if (this.form().invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Debe agregar al menos una foto',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
        showCancelButton: false,
      });
      return;
    }

    const formData = new FormData();
    const file = this.form().controls['file'].value as File;
    formData.append('file', file);
    this.dialogRef.close({ response: true, data: formData });
  }
}
