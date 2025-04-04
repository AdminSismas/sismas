import { Component, Inject, OnInit } from '@angular/core';

import { FormBuilder, FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import Swal from 'sweetalert2';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { ExtraInfoPerson, InfoPerson } from '../../../../../../../apps/interfaces/information-property/info-person';
import { MatDivider } from '@angular/material/divider';
import { MatIcon } from '@angular/material/icon';
import {
  ComboxColletionFormComponent
} from '../../../../../../../apps/components/general-components/combox-colletion-form/combox-colletion-form.component';
import { InputComponent } from '../../../../../../../apps/components/general-components/input/input.component';
import { MatButton, MatIconButton } from '@angular/material/button';
import { PeopleService } from '../../../../../../../apps/services/users/people.service';
import { validateVariable } from '../../../../../../../apps/utils/general';
import { TypeOperationPeople } from '../../../../../../../apps/interfaces/general/content-info';
import { PAGE, PAGE_SIZE } from '../../../../../../../apps/constants/general/constants';
import { stagger20ms } from '@vex/animations/stagger.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';

@Component({
  selector: 'vex-update-participant',
  standalone: true,
  animations: [stagger20ms, fadeInUp400ms, scaleFadeIn400ms],
  imports: [
    ReactiveFormsModule,
    MatDialogTitle,
    MatDivider,
    MatDialogClose,
    MatIcon,
    MatIconButton,
    MatDialogContent,
    ComboxColletionFormComponent,
    InputComponent,
    MatButton,
    MatDialogActions
  ],
  templateUrl: './update-participant.component.html',
  styleUrl: './update-participant.component.scss'
})
export class UpdateParticipantComponent implements OnInit {
  label: string = 'Actualizar Participante';

  form: FormGroup = this.fb.group({
    individualId: [{ value: this.defaults?.individualId || '' }],
    firstName: [{ value: this.defaults?.firstName || '' }],
    middleName: [{ value: this.defaults?.middleName || '' }],
    lastName: [{ value: this.defaults?.lastName || '' }],
    otherLastName: [{ value: this.defaults?.lastName || '' }],
    domIndividualTypeNumber: [{ value: this.defaults?.domIndividualTypeNumber || '' }],
    number: [{ value: this.defaults?.number || '' }],
    companyName: [{ value: this.defaults?.companyName || '' }],
    domIndividualSex: [this.defaults?.domIndividualSex || ''],
    domIndividualType: [
      { value: this.defaults?.domIndividualType || '' },
      Validators.required
    ],
    domIndividualEthnicGroup: [this.defaults?.domIndividualEthnicGroup || '']
  });
  mode: TypeOperationPeople | null = 'update';

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: ExtraInfoPerson | undefined,
    private dialogRef: MatDialogRef<UpdateParticipantComponent>,
    private fb: FormBuilder,
    private peopleServcie: PeopleService
  ) {
  }

  ngOnInit() {
    if (!this.defaults || this.defaults && this.defaults?.mode === null) {
      return;
    }
    this.mode = this.defaults?.mode;
    this.sendPerson();
  }

  sendPerson() {
    if (this.defaults?.number == null || !validateVariable(this.defaults?.number) ||
      this.defaults?.domIndividualTypeNumber == null || !validateVariable(this.defaults?.domIndividualTypeNumber)) {
      Swal.fire({
        text: 'Ingresar tipo documento o número de documento',
        icon: 'error',
        showConfirmButton: false,
        timer: 10000
      }).then();
      return;
    }
    this.getPeople(
      this.defaults?.number,
      this.defaults?.domIndividualTypeNumber
    );
  }

  getPeople(numberID: string, typeDocument: string) {
    const obj = {
      number: numberID, individualTypeNumber: typeDocument,
      page: PAGE, size: PAGE_SIZE
    };
    this.peopleServcie.getPeopleTypeNumber(obj).subscribe({
      error: (error: HttpErrorResponse) => {
        if (error.status == HttpStatusCode.NotFound) {
          this.getMessageError(
            'No se encontro persona a consultar.', true, null
          );
          return;
        }
      },
      next: (result: InfoPerson) => {
        if (result) {
          this.defaults = {
            ...result,
            mode: 'update'
          } as ExtraInfoPerson;
          this.changeInfo(this.defaults);
          this.form.patchValue(this.defaults);
          this.updatePatchValue();

          this.clearValidatorsTow();
          this.disableDocumentAndType();
          this.disableNaturalPerson();
          this.disableLegalPerson();
          this.updateValidators();
        }
      }
    });
  }

  updatePatchValue(): void {
    const llaves = Object.keys(this.form.controls);
    for (let i = 0; i < llaves.length; i++) {
      this.form.get(llaves[i])?.clearValidators();
      this.form.get(llaves[i])?.updateValueAndValidity();
    }
  }

  disableLegalPerson(): void {
    this.form.get('companyName')?.disable();
  }

  disableNaturalPerson(): void {
    this.form.get('firstName')?.disable();
    this.form.get('lastName')?.disable();
    this.form.get('middleName')?.disable();
    this.form.get('otherLastName')?.disable();
  }

  disableDocumentAndType(): void {
    this.form.get('number')?.disable();
    this.form.get('domIndividualTypeNumber')?.disable();
    this.form.get('domIndividualType')?.disable();
  }

  updatePeople() {
    if (!this.defaults || this.defaults && this.defaults?.mode === null) {
      this.getMessageError(
        'Error no se encontro informacion del participante', true, null
      );
      return;
    }
    let individualId = this.defaults.individualId;
    const people = this.defaults;
    if (!individualId || individualId <= 0) {
      this.getMessageError(
        'Error al tratar de actualizar el participante', true, null
      );
      return;
    }

    if (this.form.get('domIndividualTypeNumber')?.value === 'NIT') {
      const validate: boolean | null = this.validateNit(this.form.get('number')?.value);
      if (validate) {
        this.getMessageError(
          'Número de formato NIT no válido', false, null
        );
        return;
      }
    }

    if (!people.individualId) {
      people.individualId = this.defaults.individualId;
    }
    people.number = this.controlNumber.value;
    people.domIndividualType = this.controlDomIndividualType.value;
    people.firstName = this.controlFirstName.value;
    people.middleName = this.controlMiddleName.value;
    people.lastName = this.controlLastName.value;
    people.otherLastName = this.controlOtherLastName.value;
    people.companyName = this.controlCompanyName.value;
    people.domIndividualSex = this.controlIndividualSex.value;
    people.domIndividualEthnicGroup = this.controlDomIndividualEthnicGroup.value;
    this.peopleServcie.userEdit(individualId.toString(), people).subscribe({
      next: (res) => {
        this.getMessageSuccess(
          'Persona actualizada exitosamente',
          true, res);
      },
      error: () => {
      }
    });
  }

  clearValidatorsTow(): void {
    const llaves = Object.keys(this.form.controls);
    for (let i = 0; i < llaves.length; i++) {
      this.form.get(llaves[i])?.clearValidators();
      this.form.get(llaves[i])?.updateValueAndValidity();
    }
  }

  updateValidators(): void {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.updateValueAndValidity();
    });
  }

  validateNit(nit: any): boolean {
    return /^\d{9}-\d$/.test(nit);
  }

  changeInfo(obj: ExtraInfoPerson): void {
    Object.entries(obj).forEach(([key, value]) => {
      if (this.form.controls[key]) {
        this.form.controls[key].setValue(value);
      }
    });
  }

  getMessageError(msg: string, closeModal: boolean = true, obj: any) {
    Swal.fire({
      text: msg,
      icon: 'error',
      showConfirmButton: false,
      timer: 10000
    }).then(() => {
      if (closeModal) {
        this.dialogRef.close(obj);
      }
    });
  }

  getMessageSuccess(msg: string, closeModal: boolean = true, obj: any) {
    Swal.fire({
      text: msg,
      icon: 'success',
      showConfirmButton: false,
      timer: 10000
    }).then(() => {
      if (closeModal) {
        this.dialogRef.close(obj);
      }
    });
  }

  get controlDomIndividualType() {
    return this.form.get('domIndividualType') as FormControl;
  }

  get controlDomIndividualTypeNumber() {
    return this.form.get('domIndividualTypeNumber') as FormControl;
  }

  get controlNumber() {
    return this.form.get('number') as FormControl;
  }

  get controlFirstName() {
    return this.form.get('firstName') as FormControl;
  }

  get controlMiddleName() {
    return this.form.get('middleName') as FormControl;
  }

  get controlLastName() {
    return this.form.get('lastName') as FormControl;
  }

  get controlOtherLastName() {
    return this.form.get('otherLastName') as FormControl;
  }

  get controlDomIndividualEthnicGroup() {
    return this.form.get('domIndividualEthnicGroup') as FormControl;
  }

  get controlIndividualSex() {
    return this.form.get('domIndividualSex') as FormControl;
  }

  get controlCompanyName() {
    return this.form.get('companyName') as FormControl;
  }
}
