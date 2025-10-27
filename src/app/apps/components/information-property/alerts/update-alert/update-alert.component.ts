import { Component, inject, signal } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { AlertResponse } from 'src/app/apps/interfaces/information-property/alerts.interface';
import { DynamicFormsComponent } from 'src/app/apps/components/forms/dynamic-forms/dynamic-forms.component';import { FormGroup } from '@angular/forms';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { formAlertUpdateInputsJson } from 'src/app/apps/constants/information-property/alerts.constants';
import Swal from 'sweetalert2';

interface UpdateAlertData {
  alert: AlertResponse;
  baunitId: string;
  executionId: string;
}

@Component({
  selector: 'vex-update-alert',
  standalone: true,
  imports: [
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    MatButtonModule,
    DynamicFormsComponent
  ],
  templateUrl: './update-alert.component.html',
})
export class UpdateAlertComponent {
  protected readonly formAlertUpdateInputsJson = formAlertUpdateInputsJson;

  // Define injections
  data = inject<UpdateAlertData>(MAT_DIALOG_DATA);
  dialogRef = inject(MatDialogRef<UpdateAlertComponent>);

  // Define properties
  form = signal<FormGroup>(new FormGroup({}));

  onSubmit(): void {
    if (this.form().invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: 'Los campos de tipo de alerta y estado de alerta son requeridos',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
        showCancelButton: false,
      });

      return;
    }
    this.dialogRef.close({
      response: true,
      data: this.form().value,
    });
  }
}
