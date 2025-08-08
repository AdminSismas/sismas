/* eslint-disable @typescript-eslint/no-explicit-any */
import { Component, Inject, OnInit } from '@angular/core';

import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators
} from '@angular/forms';

import {
  MAT_DIALOG_DATA,
  MatDialogModule,
  MatDialogRef
} from '@angular/material/dialog';
import { People as People } from '../../../../../apps/interfaces/users/people.model';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatDividerModule } from '@angular/material/divider';
import { MatIconModule } from '@angular/material/icon';
import { MatMenuModule } from '@angular/material/menu';
import { MatButtonModule } from '@angular/material/button';
import { NgIf } from '@angular/common';
import { PeopleService } from '../../../../../apps/services/users/people.service';
import {
  PAGE,
  PAGE_SIZE
} from '../../../../../apps/constants/general/constants';
import { ComboboxCollectionFormComponent } from '../../../../../apps/components/general-components/combobox-collection-form/combobox-collection-form.component';
import { InputComponent } from '../../../../../apps/components/general-components/input/input.component';
import { validateVariable } from '../../../../../apps/utils/general';
import Swal from 'sweetalert2';
import { InfoPerson } from '../../../../../apps/interfaces/information-property/info-person';
import { BehaviorSubject } from 'rxjs';
import { filter } from 'rxjs/operators';
import { HttpErrorResponse, HttpStatusCode } from '@angular/common/http';
import { fadeInRight400ms } from '@vex/animations/fade-in-right.animation';
import { stagger40ms, stagger80ms } from '@vex/animations/stagger.animation';
import { scaleIn400ms } from '@vex/animations/scale-in.animation';
import { fadeInUp400ms } from '@vex/animations/fade-in-up.animation';
import { scaleFadeIn400ms } from '@vex/animations/scale-fade-in.animation';

export interface defaultData extends People {
  mode: 'create' | 'update';
}

@Component({
  selector: 'vex-create-people',
  standalone: true,
  animations: [
    fadeInRight400ms,
    stagger80ms,
    scaleIn400ms,
    stagger40ms,
    fadeInUp400ms,
    scaleFadeIn400ms
  ],
  imports: [
    ReactiveFormsModule,
    MatDialogModule,
    NgIf,
    MatButtonModule,
    MatMenuModule,
    MatIconModule,
    MatDividerModule,
    MatFormFieldModule,
    MatInputModule,
    ComboboxCollectionFormComponent,
    InputComponent
  ],
  templateUrl: './create-people.component.html',
  styleUrl: './create-people.component.scss'
})
export class CreatePeopleComponent implements OnInit {
  typeDocument = 'tipo';
  typeIndividualSex = '';
  typePersons = '';
  typeEthnicGroup = '';

  page = PAGE;
  size = PAGE_SIZE;

  form = this.fb.group({
    individualId: [this.defaults?.id ?? ''],
    firstName: [this.defaults?.firstName ?? ''],
    middleName: [this.defaults?.middleName ?? ''],
    lastName: [this.defaults?.lastName ?? ''],
    otherLastName: [this.defaults?.lastName ?? ''],
    domIndividualTypeNumber: [this.defaults?.domIndividualTypeNumber ?? ''],
    number: [this.defaults?.number ?? ''],
    companyName: [this.defaults?.companyName ?? ''],
    domIndividualSex: [this.defaults?.domIndividualSex ?? ''],
    domIndividualType: [
      this.defaults?.domIndividualType ?? '',
      Validators.required
    ],
    domIndividualEthnicGroup: [this.defaults?.domIndividualEthnicGroup ?? '']
  });
  mode: 'create' | 'update' = 'create';

  menssage = {
    status: false,
    value: ''
  };

  private _createPeople = new BehaviorSubject<boolean>(false);
  isSecuencial = false;
  createPeople$ = this._createPeople.asObservable();

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: defaultData | undefined,
    private dialogRef: MatDialogRef<CreatePeopleComponent>,
    private fb: FormBuilder,
    private peopleServcie: PeopleService
  ) {}

  ngOnInit() {
    if (!this.defaults) {
      this.defaults = {} as defaultData;
    }
    this.mode = this.defaults?.mode ?? 'create';
    if (this.mode === 'create') {
      this.form.reset(this.defaults);
      this.domIndividualTypeNumberChange(
        this.defaults?.domIndividualTypeNumber
      );
    }
    this.disablesTypePople();
    this.form.patchValue(this.defaults);
    this.validateTypePeople();

    this.createPeople$
      .pipe(filter<boolean>(Boolean))
      .subscribe((result: boolean) => {
        if (result) {
          this.sendCreatePeople();
        }
      });
  }

  save() {
    if (this.mode === 'create') {
      this.createPeople();
    } else if (this.mode === 'update') {
      this.updatePeople();
    }
  }

  createPeople() {
    // validaciones si existe un campo requerido
    if (this.form.invalid) {
      this.menssage = {
        status: true,
        value: 'Completa los campos requeridos'
      };
      return;
    }

    //validamos que el input de palabra
    if (this.form.get('firstName')?.value !== '') {
      const validate = this.validateSingleWord(
        this.form.get('firstName')?.value
      );

      if (validate) {
        this.menssage.status = true;
        this.menssage.value = 'El nombre no puede tener espacios';
        return;
      }
    }

    //validamos que el input de palabra
    if (this.form.get('lastName')?.value !== '') {
      const validate: boolean = this.validateSingleWord(
        this.form.get('lastName')?.value
      );

      if (validate) {
        this.menssage.status = true;
        this.menssage.value = 'El apellido no puede tener espacios';
        return;
      }
    }

    // validamos nit
    if (this.form.get('domIndividualTypeNumber')?.value === 'NIT') {
      const validate: boolean | null = this.validateNit(
        this.form.get('number')?.value
      );

      if (validate) {
        this.menssage.status = true;
        this.menssage.value = 'Número de formato NIT no válido';
        return;
      }
    }
    /* NOTA: validamos el usuario */
    this.personRegister(true);
  }

  sendCreatePeople() {
    this.menssage.status = false;
    const body = { ...this.form.value, number: this.form.get('number')!.value } as People;

    this.peopleServcie.createPeople(body).subscribe({
      next: () => {
        Swal.fire({
          text: 'Persona registrada',
          icon: 'success',
          showConfirmButton: false,
          timer: 10000
        }).then(() => {
          this.dialogRef.close({
            number: this.form.get('number')?.value,
            domIndividualTypeNumber: this.form.get('domIndividualTypeNumber')
              ?.value
          });
        });
      }
    });
  }

  personRegister(createPeople = false) {
    this.menssage = {
      status: false,
      value: ''
    };
    const numberID: string | null = this.form.get('number')?.value;
    const typeDocument: string | null | undefined = this.form.get(
      'domIndividualTypeNumber'
    )?.value;

    //información de número de documento
    if (
      numberID == null ||
      !validateVariable(numberID) ||
      typeDocument == null ||
      !validateVariable(typeDocument)
    ) {
      Swal.fire({
        text: 'Ingresar tipo documento o número de documento',
        icon: 'error',
        showConfirmButton: false,
        timer: 10000
      }).then();
      return;
    }
    this.getPeople(numberID, typeDocument, createPeople);
  }

  getPeople(numberID: string, typeDocument: string, createPeople = false) {
    const obj = {
      number: numberID,
      individualTypeNumber: typeDocument,
      page: this.page,
      size: this.size
    };

    this.peopleServcie.getPersonByDocumentNumber(obj).subscribe({
      error: (error: HttpErrorResponse) => {
        if (error.status == HttpStatusCode.NotFound) {
          if (createPeople) {
            this._createPeople.next(true);
            return;
          }
          Swal.fire({
            text: 'No se encontro persona a consultar.',
            icon: 'error',
            showConfirmButton: false,
            timer: 10000
          }).then(() => {
            this.validateTypePeople();
          });
          return;
        }
      },
      next: (result: InfoPerson) => {
        if (this.mode !== 'update' && result) {
          this.disablesTypePople();
          this.menssage = {
            status: true,
            value: 'La persona ya se encuentra registrada'
          };
          return;
        }
        if (createPeople) {
          this._createPeople.next(true);
          return;
        }
        this.validateTypePeople();
      }
    });
  }

  updatePeople() {
    const { individualId } = this.form.value;
    const people = this.form.value;
    if (!individualId || individualId === '') {
      return;
    }
    //validamos que el input de palabra
    if (this.form.get('firstName')?.value !== '') {
      const validate = this.validateSingleWord(
        this.form.get('firstName')?.value
      );
      if (validate) {
        this.menssage.status = true;
        this.menssage.value = 'El nombre no puede tener espacios';
        return;
      }
    }

    //validamos que el input de palabra
    if (this.form.get('lastName')?.value !== '') {
      const validate: boolean = this.validateSingleWord(
        this.form.get('lastName')?.value
      );

      if (validate) {
        this.menssage.status = true;
        this.menssage.value = 'El apellido no puede tener espacios';
        return;
      }
    }

    if (this.form.get('domIndividualTypeNumber')?.value === 'NIT') {
      const validate: boolean | null = this.validateNit(
        this.form.get('number')?.value
      );

      if (validate) {
        this.menssage.status = true;
        this.menssage.value = 'Número de formato NIT no válido';
        return;
      }
    }

    if (!this.defaults) {
      throw new Error(
        'Customer ID does not exist, this customer cannot be updated'
      );
    }
    this.menssage.status = false;
    people.number = this.defaults.number;
    people.domIndividualType = this.defaults.domIndividualType;
    this.peopleServcie.editPerson(individualId.toString(), people).subscribe({
      next: (response) => {
        Swal.fire({
          text: 'Persona actualizada',
          icon: 'success',
          showConfirmButton: false,
          timer: 10000
        }).then(() => this.dialogRef.close({ response: true, data: response }));
      }
    });

    // this.dialogRef.close(customer);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    return this.mode === 'update';
  }

  validateSingleWord(value: any): boolean {
    const word = value;
    const aWord = /^\S+$/.test(word);

    return aWord ? false : true;
  }

  disablesTypePople(): void {
    // validar los tipos de campos según los valores de los formularios
    this.form.get('firstName')?.disable();
    this.form.get('middleName')?.disable();
    this.form.get('otherLastName')?.disable();
    this.form.get('domIndividualSex')?.disable();
    this.form.get('lastName')?.disable();
    this.form.get('companyName')?.disable();
    this.form.get('domIndividualEthnicGroup')?.disable();
  }

  clearValidatorsTow(): void {
    const llaves = Object.keys(this.form.controls);
    // eslint-disable-next-line @typescript-eslint/prefer-for-of
    for (let i = 0; i < llaves.length; i++) {
      this.form.get(llaves[i])?.clearValidators();
      this.form.get(llaves[i])?.updateValueAndValidity();
    }
  }

  // Actualiza los validadores en los campos del formulario
  updateValidators(): void {
    Object.keys(this.form.controls).forEach((key) => {
      this.form.get(key)?.updateValueAndValidity();
    });
  }

  // validar nit
  validateNit(nit: any): boolean {
    const word = nit;
    const aWord = /^\d{9}-\d$/.test(word);

    return aWord;
  }

  validateTypePeople(): void {
    // validar los tipos de campos según los valores de los formularios
    this.clearValidatorsTow();
    const type = this.form.get('domIndividualType')?.value;
    if (type === 'Persona natural') {
      this.form.get('firstName')?.setValidators(Validators.required);
      this.form.get('lastName')?.setValidators(Validators.required);
      this.form.get('number')?.setValidators(Validators.required);
      this.form
        .get('domIndividualTypeNumber')
        ?.setValidators(Validators.required);

      if (this.mode === 'update') {
        this.form.get('number')?.disable();
        this.form.get('domIndividualType')?.disable();
      }

      this.form.get('firstName')?.enable();
      this.form.get('lastName')?.enable();
      this.form.get('middleName')?.enable();
      this.form.get('otherLastName')?.enable();
      this.form.get('domIndividualEthnicGroup')?.enable();
      this.form.get('domIndividualSex')?.enable();
      this.form.get('companyName')?.disable();
    } else if (type === 'Persona jurídica') {
      this.form.get('companyName')?.setValidators(Validators.required);
      this.form.get('companyName')?.enable();
      this.form.get('number')?.setValidators(Validators.required);
      this.form
        .get('domIndividualTypeNumber')
        ?.setValidators(Validators.required);

      if (this.mode === 'update') {
        this.form.get('number')?.disable();
        this.form.get('domIndividualType')?.disable();
      }

      this.form.get('firstName')?.disable();
      this.form.get('lastName')?.disable();
      this.form.get('domIndividualEthnicGroup')?.disable();
      this.form.get('domIndividualSex')?.disable();
      this.form.get('middleName')?.disable();
      this.form.get('otherLastName')?.disable();
    }
    this.form.get('domIndividualType')?.setValidators(Validators.required);
    this.updateValidators();
  }

  domIndividualTypeNumberChange(event: string) {
    if (!event) return;

    if (event === 'Secuencial') {
      this.controlNumber.disable();
      this.isSecuencial = true;
      return;
    }
    this.isSecuencial = false;
    this.controlNumber.enable();
  }

  createSecuentialPerson() {
    if (this.form.controls['domIndividualTypeNumber'].value !== 'Secuencial')
      return;

    if (this.form.invalid) {
      Swal.fire({
        text: 'Completa los campos requeridos',
        icon: 'error',
        showConfirmButton: false,
        timer: 10000
      });
      return;
    }

    this.peopleServcie.getSequencialCode().subscribe({
      next: (result: string) => {
        const controlNames = Object.keys(this.form.controls);

        controlNames.forEach((key) => {
          if (key === 'number') {
            this.form.get('number')?.setValue(result);
            return;
          }
          this.form.get(key)?.enable();
        });
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
