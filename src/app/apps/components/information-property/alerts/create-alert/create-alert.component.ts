import { Component, inject, signal } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { DynamicFormsComponent } from '@shared/utils/dynamic-forms/dynamic-forms.component';import Swal from 'sweetalert2';
import { formAlertCreateInputsJson } from 'src/app/apps/constants/information-property/alerts.constants';

@Component({
  selector: 'vex-create-alert',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    DynamicFormsComponent
  ],
  templateUrl: './create-alert.component.html'
})
export class CreateAlertComponent {
  protected readonly formAlertInputsJson = formAlertCreateInputsJson;

  form = signal<FormGroup>(new FormGroup({}));

  dialogRef = inject(MatDialogRef<CreateAlertComponent>);

  onSubmit(): void {
    if (this.form().invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'El tipo de alerta es requerido',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
        showCancelButton: false
      });

      return;
    }

    this.dialogRef.close({ response: true, data: this.form().value });
    return;
  }
}
