/* eslint-disable @typescript-eslint/no-explicit-any */
import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  inject,
  OnInit,
  signal
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
import { MatButtonModule } from '@angular/material/button';
import { MatNativeDateModule } from '@angular/material/core';
import { MatDatepickerModule } from '@angular/material/datepicker';
import {
  MAT_DIALOG_DATA,
  MatDialog,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { RrrightService } from 'src/app/apps/services/bpm/rrright.service';
import { ComboboxCollectionComponent } from '../../../general-components/combobox-collection/combobox-collection.component';
import { DialogsData } from 'src/app/apps/interfaces/bpm/changes-property-owner';
import { PeopleService } from '../../../../services/users/people.service';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { MatDividerModule } from '@angular/material/divider';
import Swal from 'sweetalert2';
import {
  CreatePeopleComponent,
  defaultData
} from 'src/app/pages/pages/operation-support/people/create-people/create-people.component';
import { MODAL_SMALL } from 'src/app/apps/constants/general/constants';
import { People } from 'src/app/apps/interfaces/users/people.model';
import { ModalResponse } from '../../../general-components/modal-window/modal-window.component';

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
    ComboboxCollectionComponent,
    MatDividerModule
  ],
  templateUrl: './editing-property-owner.component.html',
  styleUrl: './editing-property-owner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class EditingPropertyOwnerComponent implements OnInit {
  // Inject signals
  private dialog = inject(MatDialog);
  private rrrightService = inject(RrrightService);
  private peopleService = inject(PeopleService);
  private fb = inject(FormBuilder);
  private dialogRef = inject(MatDialogRef<EditingPropertyOwnerComponent>);
  public data = inject<DialogsData>(MAT_DIALOG_DATA);

  maxDate = new Date();
  form: FormGroup = this.fb.group({
    fraction: [
      0,
      [
        Validators.required,
        Validators.max(1),
        Validators.min(0),
        this.createFractionValidator()
      ]
    ],
    fractions_sum: [0],
    domRightType: ['', Validators.required],
    beginAt: [Date(), Validators.required]
  });
  private reloadAtClose = signal<boolean>(false);

  ngOnInit(): void {
    const formValues = {
      ...this.data.rrrightInfo!,
      fractions_sum: this.data.fractions_sum!
    };

    if (formValues?.beginAt) {
      formValues.beginAt = new Date(
        this.data.rrrightInfo!.beginAt + 'T00:00:00-05:00'
      );
    }
    this.form.reset(formValues);
    this.form.get('fractions_sum')!.disable();
  }

  close(): void {
    this.dialogRef.close(this.reloadAtClose());
  }

  editRrrightOwnerProperty(): any {
    if (this.form.invalid) {
      Swal.fire({
        icon: 'error',
        title: 'Error fracción',
        text: 'El valor de la fracción no es válido',
        confirmButtonText: 'Aceptar',
        confirmButtonColor: '#3085d6',
        timer: 10000
      });
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

    this.peopleService
      .getPeopleTypeNumber({
        number: number,
        individualTypeNumber: domIndividualTypeNumber
      })
      .subscribe((res: InfoPerson) => {
        values.individual = { individualId: res.individualId };
        this.rrrightService
          .updatePropertyOwner({
            executionId: this.data.executionId,
            baunitId: this.data.baunitId,
            schema: this.data.schema as string,
            params: values
          })
          .subscribe(() => {
            this.reloadAtClose.set(true);
            this.close();
          });
      });
  }

  private createFractionValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const fraction = Number(control.value);
      if (fraction + this.data!.fractions_sum! > 1 || fraction < 0) {
        return { invalidFraction: true };
      }
      return null;
    };
  }

  get max(): number {
    return 1 - this.data!.fractions_sum!;
  }
  editPerson() {
    if (!this.data.showEditPerson) return;

    const person = new People({ ...this.data.individual });
    this.dialog.open(CreatePeopleComponent, {
      ...MODAL_SMALL,
      data: {
        mode: 'update',
        ...person
      } as defaultData
    }).afterClosed().subscribe((res: ModalResponse<InfoPerson>) => {
      if (res.response) {
        this.reloadAtClose.set(true);
      }
    });
  }
}
