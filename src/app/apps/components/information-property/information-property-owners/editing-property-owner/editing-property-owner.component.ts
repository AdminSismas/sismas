/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DIALOG_DATA, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RrrightService } from 'src/app/apps/services/bpm/rrright.service';
import { ComboxColletionComponent } from '../../../general-components/combox-colletion/combox-colletion.component';
import { DialogsData } from 'src/app/apps/interfaces/bpm/changes-property-owner';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PeopleService } from '../../../../services/users/people.service';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
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
  public maxDate = new Date();
  public form: FormGroup = this.fb.group({
    fraction: [0, [
      Validators.required,
      Validators.max(1),
      Validators.min(0),
      this.createFractionValidator()
    ]],
    fractions_sum: [0],
    domRightType: ['', Validators.required],
    beginAt: [Date(), Validators.required],
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: DialogsData,
    private rrrightService: RrrightService,
    private peopleService: PeopleService,
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<EditingPropertyOwnerComponent>,
    private snackbar: MatSnackBar,
  ) { }

  ngOnInit(): void {
    const formValues = {...this.data.rrrightInfo!, fractions_sum: this.data.fractions_sum!};

    if (formValues?.beginAt) {
      formValues.beginAt = new Date(
        this.data.rrrightInfo!.beginAt + 'T00:00:00-05:00'
      );
    }
    this.form.reset(formValues);
    this.form.get('fractions_sum')!.disable();
  }

  close(): void {
    this.dialogRef.close(true);
  }

  editRrrightOwnerProperty(): any {
    if (this.form.invalid) {
      this.snackbar.open('El valor de la fracción no es válido', 'CERRAR', { duration: 10000 });
      return;
    }

    const values = this.form.value;

    try {
      values.beginAt = values.beginAt.toISOString().split('T')[0];
    } catch {
      values.beginAt = values.beginAt as string;
    }
    values.rightId = this.data.rightId;

    const { number, domIndividualTypeNumber } = this.data.individual;

    this.peopleService.getPeopleTypeNumber({ number: number, individualTypeNumber: domIndividualTypeNumber })
      .subscribe((res: InfoPerson) => {
        values.individual = { individualId: res.individualId };
        this.rrrightService.updatePropertyOwner({
          executionId: this.data.executionId,
          baunitId: this.data.baunitId,
          schema: this.data.schema as string,
          params: values
        }).subscribe(() => {
          this.close();
        });
      });
  }

  private createFractionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fraction = Number(control.value);
      if (fraction + this.data!.fractions_sum! > 1 || fraction < 0) {
        return { 'invalidFraction': true };
      }
      return null;
    };
  }

  get max(): number {
    return 1 - this.data!.fractions_sum!;
  }
}
