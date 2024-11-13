import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, UntypedFormControl, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialog, MatDialogRef } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { ComboxColletionComponent } from '../../../combox-colletion/combox-colletion.component';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatButtonToggleModule } from '@angular/material/button-toggle';
import { postParamsRrright, AddPropertyOwnerData } from 'src/app/apps/interfaces/bpm/add-property-owner';
import { PeopleService } from 'src/app/apps/services/people.service';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatNativeDateModule } from '@angular/material/core'
import { RrrightService } from 'src/app/apps/services/bpm/rrright.service';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';
import { MatSnackBar } from '@angular/material/snack-bar';
import { HttpErrorResponse } from '@angular/common/http';
import { CreatePeopleComponent } from 'src/app/pages/pages/operation-support/people/create-people/create-people.component';
import { People } from 'src/app/apps/interfaces/people.model';

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
    MatNativeDateModule
  ],
  templateUrl: './add-property-owner.component.html',
  styleUrl: './add-property-owner.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AddPropertyOwnerComponent implements OnInit {

  public form: FormGroup = this.fb.group({
    individualTypeNumber: ['', Validators.required],
    number: ['', Validators.required],
  })
  public secondForm: FormGroup = this.fb.group({
    fraction: [0, Validators.required],
    domRightType: ['', Validators.required],
    beginAt: [Date(), Validators.required],
  })

  public customer?: InfoPerson;

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

    console.log(this.customer)

    const values = this.secondForm.value

    values.fraction = values.fraction / 100

    const params: postParamsRrright = {
      schema: this.defaults.schema,
      executionId: this.defaults.executionId,
      baunitId: this.defaults.baunitId,
      params: { ...values, beginAt: formatBeginAt, individual: { individualId: this.customer!.individualId } }
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
}
