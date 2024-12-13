import { Component } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { WORKFLOW_INPUTS } from 'src/app/apps/constants/workflow.constant';
import { JSONInput } from 'src/app/apps/interfaces/dynamic-forms';
import { DynamicFormsComponent } from '../../dynamic-forms/dynamic-forms.component';
import { MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar } from '@angular/material/snack-bar';

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

  public WORKFLOW_INPUTS: JSONInput[] = WORKFLOW_INPUTS

  constructor(
    private dialogRef: MatDialogRef<CreateWorkflowComponent>,
    private snackbar: MatSnackBar
  ) {}

  onSubmit() {
    if (!this.form!.valid) {
      this.snackbar.open('Se deben completar todos los campos requeridos', 'CLOSE', { duration: 4000 });
      return;
    }
    this.dialogRef.close({ result: true, data: this!.form!.value });
  }
}
