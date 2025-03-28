import { Component, Inject, OnInit } from '@angular/core';

import {
  FormBuilder, FormControl,
  ReactiveFormsModule,
  Validator,
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
import { ComboxColletionComponent } from '../../../../../apps/components/general-components/combox-colletion/combox-colletion.component';
import { PeopleService } from '../../../../../apps/services/users/people.service';
import { firstValueFrom } from 'rxjs';
import { environment } from 'src/environments/environments';
import { MatSnackBar } from '@angular/material/snack-bar';
import { PAGE, PAGE_SIZE } from '../../../../../apps/constants/general/constants';
import {
  ComboxColletionFormComponent
} from '../../../../../apps/components/general-components/combox-colletion-form/combox-colletion-form.component';
import { InputComponent } from '../../../../../apps/components/general-components/input/input.component';

interface defaultData extends People {
  mode: 'create' | 'update';
}
@Component({
  selector: 'vex-create-people',
  standalone: true,
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
    ComboxColletionComponent,
    ComboxColletionFormComponent,
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
    individualId: [this.defaults?.id || ''],
    firstName: [this.defaults?.firstName || ''],
    middleName: [this.defaults?.middleName || ''],
    lastName: [this.defaults?.lastName || ''],
    otherLastName: [this.defaults?.lastName || ''],
    domIndividualTypeNumber: [this.defaults?.domIndividualTypeNumber || ''],
    number: [this.defaults?.number || ''],
    companyName: [this.defaults?.companyName || ''],
    domIndividualSex: [this.defaults?.domIndividualSex || ''],
    domIndividualType: [
      this.defaults?.domIndividualType || '',
      Validators.required
    ],
    domIndividualEthnicGroup: [this.defaults?.domIndividualEthnicGroup || '']
  });
  mode: 'create' | 'update' = 'create';

  menssage = {
    status: false,
    value: ''
  };

  constructor(
    @Inject(MAT_DIALOG_DATA) public defaults: defaultData | undefined,
    private dialogRef: MatDialogRef<CreatePeopleComponent>,
    private fb: FormBuilder,
    private peopleServcie: PeopleService,
    private alertSnakbar: MatSnackBar
  ) {}

  ngOnInit() {
    if (this.defaults) {
      if (this.defaults.mode === 'update') {
        this.validateTypePople();
        this.mode = 'update';
      } else if (this.defaults.mode === 'create') {
        this.mode = 'create';
        this.form.reset(this.defaults);
      }
    } else {
      this.defaults = {} as defaultData;
    }
    this.disablesTypePople();
    this.form.patchValue(this.defaults);
  }

  save() {
    if (this.mode === 'create') {
      this.createPeople();
    } else if (this.mode === 'update') {
      this.updatePeople();
    }
  }

  async createPeople() {
    const people = this.form.value;

    // validaciones si existe un campo requerido
    if (!this.form.valid) {
      this.menssage = {
        status: true,
        value: 'Completa los campos requeridos'
      };
      return;
    }

    //validamos que el input de palabra
    if (this.form.get('firstName')?.value !== '') {
      const validate = this.validateSingleWord(this.form.get('firstName')?.value);

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
    this.personRegister();

    this.menssage.status = false;

    // enviamos los datos para el envío de datos

    const url_basic = `${environment.url}:${environment.port}${environment.individualNumber}`;

    const dataCreate = {
      url: url_basic,
      body: people
    };
    const resApi = this.peopleServcie.userCreate(dataCreate).subscribe({
      next: (res) => {
        this.alertSnakbar.open('Persona registrada', 'CERRAR', {
          duration: 10000,
          horizontalPosition: 'right'
        });
        this.dialogRef.close({
          number: this.form.get('number')?.value,
          domIndividualTypeNumber: this.form.get('domIndividualTypeNumber')?.value,
        });
      },
      error: (error) => {
        console.log(error);
      }
    });
  }

  async personRegister() {
    this.menssage = {
      status: false,
      value: ''
    };
    //información de número de documento
    if (
      this.form.get('number')?.value !== '' &&
      this.form.get('domIndividualTypeNumber')?.value !== ''
    ) {
      const obj = {
        number: this.form.get('number')?.value,
        individualTypeNumber: this.form.get('domIndividualTypeNumber')?.value,
        page: this.page,
        size: this.size
      };

      let datosClient: any;
      try {
        datosClient = await firstValueFrom(
          this.peopleServcie.getPeopleTypeNumber(obj)
        );
      } catch (error) {
        console.error(error);
      }
      //si es exite id entonces devolvemos el error
      if (this.mode !== 'update') {
        if (datosClient) {
          this.disablesTypePople();
          this.menssage = {
            status: true,
            value: 'La persona ya se encuentra registrada'
          };
          return;
        } else {
          this.validateTypePople();
          return;
        }
      } else {
        this.validateTypePople();
        return;
      }
    }
  }

  updatePeople() {
    const people = this.form.value;
    //validamos que el input de palabra
    if (this.form.get('firstName')?.value !== '') {
      const validate = this.validateSingleWord(this.form.get('firstName')?.value);

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

    const url_basic = `${environment.url}:${environment.port}${environment.individualNumber}/${this.form.get('individualId')?.value}?baunitId=TESTS`;

    people.number = this.defaults.number;
    people.domIndividualType = this.defaults.domIndividualType;

    const dataCreate = {
      url: url_basic,
      body: people
    };

    this.peopleServcie.userEdit(dataCreate).subscribe({
      next: (res) => {
        this.alertSnakbar.open('Persona actualizada', 'CERRAR', {
          duration: 10000,
          horizontalPosition: 'right'
        });
        this.dialogRef.close();
      },
      error: (error) => {
        console.log(error);
      }
    });

    // this.dialogRef.close(customer);
  }

  isCreateMode() {
    return this.mode === 'create';
  }

  isUpdateMode() {
    // this.validateTypePople();
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


  validateTypePople(): void {
    // validar los tipos de campos según los valores de los formularios
    this.clearValidatorsTow();

    this.form.get('domIndividualType')?.valueChanges.subscribe((type) => {
      /* NOTA: hay que llevarse esta validación a otra función para que podamos validar después */
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
    });

    this.updateValidators();
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
