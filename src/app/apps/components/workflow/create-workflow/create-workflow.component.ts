import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WORKFLOW_INPUTS } from 'src/app/apps/constants/workflow.constant';
import { JSONInput } from 'src/app/apps/interfaces/dynamic-forms';
import { DynamicFormsComponent } from '../../dynamic-forms/dynamic-forms.component';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';
import { WorkflowCollection } from 'src/app/apps/interfaces/workflow.model';

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
  styles: ``
})
export class CreateWorkflowComponent {

  public form?: FormGroup;

  public WORKFLOW_INPUTS: JSONInput[] = WORKFLOW_INPUTS;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { initValues: WorkflowCollection, mode: string },
    private dialogRef: MatDialogRef<CreateWorkflowComponent>,
    private snackbar: MatSnackBar
  ) {}

  labelAction(): string {
    if (this.data.mode === 'edit') {
      return 'Editar';
    } else {
      return 'Crear';
    }
  }

  onSubmit() {
    if (!this.form!.valid) {
      this.snackbar.open('Se deben completar todos los campos requeridos', 'CLOSE', { duration: 4000 });
      return;
    }

    if (this.data.mode === 'edit') {
      const data: WorkflowCollection = { ...this.data.initValues, ...this!.form!.value };
      this.dialogRef.close({ result: true, data: data });
    } else {
      this.dialogRef.close({ result: true, data: this!.form!.value });
    }
  }
}
