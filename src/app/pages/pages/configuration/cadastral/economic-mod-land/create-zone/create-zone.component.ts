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

  public form: FormGroup = new FormGroup({})
  public inputs: JSONInput[] = []

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: CreateZoneData,
    private dialogRef: MatDialogRef<CreateZoneComponent>
  ) { }

  ngOnInit(): void {
    this.inputs = this.data.inputs
    console.log('divpolLv1',this.data.params.divpolLv1)
    console.log('divpolLv2',this.data.params.divpolLv2)
  }

  submitForm(): void {
    console.log(this.form.value)
    this.dialogRef.close()
  }
}
