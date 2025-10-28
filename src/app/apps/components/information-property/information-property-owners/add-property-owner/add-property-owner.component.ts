import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  Inject,
  OnInit
} from '@angular/core';
import {
  AbstractControl,
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  ValidationErrors,
  ValidatorFn,
  Validators
} from '@angular/forms';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ComboboxCollectionComponent } from '@shared/utils/combobox-collection/combobox-collection.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import {
  AddPropertyOwnerData,
  Owners,
  ParamsRrright
} from '@shared/interfaces';
import { PeopleService } from '@shared/services';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core';
import { RrrightService } from '@features/bpm-workflows/services/rrright.service';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { CreatePeopleComponent } from 'src/app/pages/pages/operation-support/people/components/create-people/create-people.component';
import { MatDividerModule } from '@angular/material/divider';
import { Big } from 'big.js';
import { MODAL_SMALL_LARGE } from '@shared/constants';

@Component({
  selector: 'vex-add-property-owner',
  standalone: true,
  imports: [
    CommonModule,
    MatIconModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    ComboboxCollectionComponent,
    MatButtonModule,
    MatButtonToggleModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatDialogModule,
    MatDividerModule
  ],
  templateUrl: './add-property-owner.component.html',
  styleUrl: './add-property-owner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class AddPropertyOwnerComponent implements OnInit {
  public customer?: InfoPerson;
  public fractions_sum = 0;
  public maxDate = new Date();

  public form: FormGroup = this.fb.group({
    domIndividualTypeNumber: ['', Validators.required],
    number: ['', Validators.required]
  });
  public secondForm: FormGroup = this.fb.group({
    fraction: [
      0,
      [
        Validators.required,
        Validators.max(1),
        Validators.min(0),
        this.createFractionValidator()
      ]
    ],
    domRightType: ['', Validators.required],
    beginAt: [Date(), Validators.required]
  });

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: AddPropertyOwnerData,
    private dialogRef: MatDialogRef<AddPropertyOwnerComponent>,
    private fb: FormBuilder,
    private rrrightService: RrrightService,
    private peopleService: PeopleService,
    private snackbar: MatSnackBar,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.fractions_sum = this.defaults.ownersData.reduce(
      (acc: number, owner: Owners) => {
        const fraction = Big(owner.fractionS);
        return fraction.plus(acc).toNumber();
      },
      0
    );

    this.secondForm.disable();
  }

  close(): void {
    this.dialogRef.close();
  }

  searchPerson(): void {
    const { number, domIndividualTypeNumber } = this.form.value;

    this.peopleService.getPersonByDocumentNumber({ number, domIndividualTypeNumber }).subscribe({
      next: (res: InfoPerson) => {
        this.customer = res;

        this.secondForm.enable();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 404) {
          this.createPerson(this.form.value);
        }
      }
    });
  }

  addPropertyOwner() {
    const formatBeginAt: string = this.secondForm.value.beginAt
      .toISOString()
      .split('T')[0];

    const params: ParamsRrright = {
      schema: this.defaults.schema,
      executionId: this.defaults.executionId,
      baunitId: this.defaults.baunitId,
      params: {
        ...this.secondForm.value,
        beginAt: formatBeginAt,
        individual: { individualId: this.customer!.individualId }
      }
    };

    this.fractions_sum += Number(this.secondForm.value.fraction);

    if (this.fractions_sum > 1) {
      this.snackbar.open('La suma de fracciones es mayor a 1', 'CERRAR', {
        duration: 10000
      });
      return;
    }

    this.rrrightService.postRrrightOwnerProperty(params).subscribe({
      next: () => {
        this.snackbar.open('Propietario agregado', 'CERRAR', {
          duration: 10000
        });
        this.close();
      },
      error: (error: HttpErrorResponse) => {
        if (error.status === 400) {
          this.snackbar.open(error.error, 'Aceptar', { duration: 5000 });
        }
      }
    });
  }

  createPerson(newCustomer: {
    number: string;
    individualTypeNumber: string;
  }): void {
    this.snackbar.open('Creando usuario', 'CERRAR', { duration: 10000 });

    this.dialog
      .open(CreatePeopleComponent, {
        ...MODAL_SMALL_LARGE,
        disableClose: true,
        data: {
          ...newCustomer,
          mode: 'create'
        }
      })
      .afterClosed()
      .subscribe(
        (customer: { number: string; individualTypeNumber: string }) => {
          this.form.reset(customer);
        }
      );
  }

  private createFractionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fraction = Number(control.value);
      if (fraction + this.fractions_sum > 1 || fraction < 0) {
        return { invalidFraction: true };
      }
      return null;
    };
  }
}
