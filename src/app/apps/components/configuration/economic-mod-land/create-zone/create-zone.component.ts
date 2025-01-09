import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { DynamicFormsComponent } from 'src/app/apps/components/dynamic-forms/dynamic-forms.component';
import { JSONInput } from 'src/app/apps/interfaces/dynamic-forms';
import { CreateZoneData } from 'src/app/apps/interfaces/economic-mod-land/zone-description';

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
