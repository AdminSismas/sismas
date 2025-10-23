import { Component, inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WORKFLOW_INPUTS } from '../../../../../constants/bpm/workflow.constant';
import { JSONInput } from '@shared/interfaces';
import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef,
} from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { WorkflowCollection } from '@shared/interfaces';
import { DynamicFormsComponent } from '@shared/components';
import Swal from 'sweetalert2';

@Component({
  selector: 'vex-create-workflow',
  standalone: true,
  imports: [
    // Vex
    // Material
    MatButtonModule,
    MatDialogModule,
    MatDividerModule,
    MatIconModule,
    // Custom
    DynamicFormsComponent
  ],
  templateUrl: './create-workflow.component.html',
  styles: ``,
})
export class CreateWorkflowComponent {
  public dialogRef = inject(MatDialogRef<CreateWorkflowComponent>);
  public data = inject(MAT_DIALOG_DATA);

  public form!: FormGroup;

  public WORKFLOW_INPUTS: JSONInput[] = WORKFLOW_INPUTS;

  labelAction(): string {
    if (this.data.mode === 'edit') {
      return 'Editar';
    } else {
      return 'Crear';
    }
  }

  onSubmit() {
    if (!this.form.valid) {
      Swal.fire({
        text: 'Se deben completar todos los campos requeridos',
        icon: 'error',
        confirmButtonText: 'Aceptar',
        timer: 10000,
      });
      return;
    }

    if (this.data.mode === 'edit') {
      const data: WorkflowCollection = { ...this.data.initValues, ...this.form.value };
      this.dialogRef.close({ result: true, data: data });
    } else {
      this.dialogRef.close({ result: true, data: this.form.value });
    }
  }
}
