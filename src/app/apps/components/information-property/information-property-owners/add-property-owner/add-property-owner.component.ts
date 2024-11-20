import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogModule, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ComboxColletionComponent } from '../../../combox-colletion/combox-colletion.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { ParamsRrright, AddPropertyOwnerData, Owners } from 'src/app/apps/interfaces/bpm/changes-property-owner';
import { PeopleService } from 'src/app/apps/services/people.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'
import { RrrightService } from 'src/app/apps/services/bpm/rrright.service';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { CreatePeopleComponent } from 'src/app/pages/pages/operation-support/people/create-people/create-people.component';
import { People } from 'src/app/apps/interfaces/people.model';
import { MatDividerModule } from '@angular/material/divider';

@Component({
  selector: 'vex-add-property-owner',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ComboxColletionComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatDividerModule,
  ],
  templateUrl: './add-property-owner.component.html',
  styleUrl: './add-property-owner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPropertyOwnerComponent implements OnInit {
  public customer?: InfoPerson;
  public fractions_sum: number = 0;

  public form: FormGroup = this.fb.group({
    individualTypeNumber: ['', Validators.required],
    number: ['', Validators.required],
  })
  public secondForm: FormGroup = this.fb.group({
    fraction: [0, [
      Validators.required,
      Validators.max(1),
      Validators.min(0),
      this.createFractionValidator()
    ]],
    domRightType: ['', Validators.required],
    beginAt: [Date(), Validators.required],
  })

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: AddPropertyOwnerData,
    private dialogRef: MatDialogRef<AddPropertyOwnerComponent>,
    private fb: FormBuilder,
    private rrrightService: RrrightService,
    private peopleService: PeopleService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    console.log(this.defaults)
    this.fractions_sum = this.defaults.ownersData.reduce((acc: number, owner: Owners) => {
      const fraction = Number(owner.fractionS)
      return acc + fraction ;
    }, 0)

    this.secondForm.disable()
  }

  close(): void {
    this.dialogRef.close();
  }

  searchPerson(): void {
    this.peopleService.getPeopleTypeNumber(this.form.value)
      .subscribe({
        next: (res: InfoPerson) => {
        this.customer = res;

        this.secondForm.enable()
        },
        error: (error: HttpErrorResponse) => {
          if (error.status === 404){
            this.createPerson()
          }
        }
      })
  }

  addPropertyOwner() {
    const formatBeginAt: string = this.secondForm.value.beginAt.toISOString().split('T')[0]

    const params: ParamsRrright = {
      schema: this.defaults.schema,
      executionId: this.defaults.executionId,
      baunitId: this.defaults.baunitId,
      params: { ...this.secondForm.value, beginAt: formatBeginAt, individual: { individualId: this.customer!.individualId } }
    }

    this.fractions_sum += Number(this.secondForm.value.fraction)

    if (this.fractions_sum > 1) {
      this.snackbar.open('La suma de fracciones es mayor a 1', 'CLOSE', { duration: 4000 })
      return;
    }

    this.rrrightService.postRrrightOwnerProperty(params)
      .subscribe((res: any) => {
        this.close()
      })

    this.snackbar.open('Propietario agregado', 'CLOSE', { duration: 4000 })
  }

  createPerson(): void {
    this.snackbar.open('Creando usuario', 'CLOSE', { duration: 4000 })

    this.dialog.open(CreatePeopleComponent)
      .afterClosed()
      .subscribe((newCustomer) => {
        console.log(newCustomer)
      })
  }

  private createFractionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fraction = Number(control.value)
      if (fraction + this.fractions_sum > 1 || fraction < 0) {
        return { 'invalidFraction': true }
      }
      return null
    }
  }
}
