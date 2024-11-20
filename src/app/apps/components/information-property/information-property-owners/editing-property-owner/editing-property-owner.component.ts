import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RrrightService } from 'src/app/apps/services/bpm/rrright.service';
import { ComboxColletionComponent } from '../../../combox-colletion/combox-colletion.component';
import { DialogsData } from 'src/app/apps/interfaces/bpm/changes-property-owner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PeopleService } from 'src/app/apps/services/people.service';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { DateTime } from 'luxon';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'vex-editing-property-owner',
  standalone: true,
  imports: [
    CommonModule,
    MatDialogModule,
    ReactiveFormsModule,
    MatInputModule,
    MatButtonModule,
    MatFormFieldModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatIconModule,
    ComboxColletionComponent,
    MatDividerModule,
  ],
  templateUrl: './editing-property-owner.component.html',
  styleUrl: './editing-property-owner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class EditingPropertyOwnerComponent implements OnInit {

  public form: FormGroup = this.fb.group({
    fraction: [0, Validators.required],
    domRightType: ['', Validators.required],
    beginAt: [Date(), Validators.required],
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogsData,
    private rrrightService: RrrightService,
    private peopleService: PeopleService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditingPropertyOwnerComponent>,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    const formValues = this.data.rrrightInfo

    this.form.reset(formValues)
  }

  close(): void {
    this.dialogRef.close();
  }

  editRrrightOwnerProperty(): any {
    const values = this.form.value

    try {
      values.beginAt = values.beginAt.toISOString().split('T')[0]
    } catch (e) {
      values.beginAt = values.beginAt
    }



    values.rightId = this.data.rightId

    const { number, domIndividualTypeNumber } = this.data.individual

    this.peopleService.getPeopleTypeNumber({ number: number, individualTypeNumber: domIndividualTypeNumber })
      .subscribe((res: InfoPerson) => {
        values.individual = { individualId: res.individualId }
        this.rrrightService.updatePropertyOwner({
          executionId: this.data.executionId,
          baunitId: this.data.baunitId,
          schema: this.data.schema as string,
          params: values
        }).subscribe(() => {
          this.snackbar.open('Propietario actualizado', 'CLOSE', { duration: 4000 })
          this.close()
        })
      })
  }
}
