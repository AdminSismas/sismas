import { Component, Inject } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { JSONInput } from '@shared/interfaces';
import { CadastreChangeLog } from 'src/app/apps/interfaces/economic-mod-land/zone-description';
import { DynamicFormsComponent } from '@shared/components';

@Component({
  selector: 'vex-cadastral-change-log',
  standalone: true,
  imports: [
    /* Material */
    MatDialogModule,
    MatDividerModule,
    MatButtonModule,
    /* Custom components */
    DynamicFormsComponent
  ],
  templateUrl: './cadastral-change-log.component.html',
  styles: ``
})
export class CadastralChangeLogComponent{

  public form?: FormGroup;

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { inputs: JSONInput[], data?: CadastreChangeLog },
    private dialogRef: MatDialogRef<CadastralChangeLogComponent>
  ) {}

  submitForm(): void {
    if (this.form?.invalid) return;
    this.dialogRef.close(this.form!.value);
  }
}
