import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { DynamicFormsComponent } from '@shared/utils/dynamic-forms/dynamic-forms.component';import { JSONInput } from '@shared/interfaces/forms';
import { CreateZoneData } from '@features/economic-zones/models';

@Component({
  selector: 'vex-create-zone',
  standalone: true,
  imports: [
    /* Material */
    MatDialogModule,
    MatDividerModule,
    MatButtonModule,
    /* Custom components */
    DynamicFormsComponent
  ],
  templateUrl: './create-zone.component.html',
  styles: ``
})
export class CreateZoneComponent implements OnInit {

  public form: FormGroup = new FormGroup({});
  public inputs: JSONInput[] = [];
  public actionLabel = 'Crear';

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateZoneData,
    private dialogRef: MatDialogRef<CreateZoneComponent>
  ) { }

  ngOnInit(): void {
    this.inputs = this.data.inputs;

    if (this.data.data) {
      this.actionLabel = 'Editar';
    }
  }

  submitForm(): void {
    if (this.form.invalid) return;
    this.dialogRef.close(this.form.value);
  }
}
