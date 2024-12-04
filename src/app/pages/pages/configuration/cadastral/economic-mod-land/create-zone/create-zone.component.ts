import { Component, Inject, OnInit } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatDividerModule } from '@angular/material/divider';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { ComboxColletionComponent } from 'src/app/apps/components/combox-colletion/combox-colletion.component';
import { DynamicFormsComponent } from 'src/app/apps/components/dynamic-forms/dynamic-forms.component';
import { JSONInput } from 'src/app/apps/interfaces/dynamic-forms';

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
    @Inject(MAT_DIALOG_DATA) public data: { title: string, inputs: JSONInput[] },
    private dialogRef: MatDialogRef<CreateZoneComponent>
  ) { }

  ngOnInit(): void {
    this.inputs = this.data.inputs
  }

  submitForm(): void {
    console.log(this.form.value)
    this.dialogRef.close()
  }
}
