import {
  AfterViewInit,
  Component,
  effect,
  inject,
  input,
  output,
  signal
} from '@angular/core';
import { DynamicFormsComponent } from 'src/app/apps/components/forms/dynamic-forms/dynamic-forms.component';import { CREATE_PERSON_FORM } from '../../constants';
import { FormGroup, Validators } from '@angular/forms';
import Swal from 'sweetalert2';
import { CreatePersonService } from '../../services/create-person.service';
import { InfoPerson } from 'src/app/apps/interfaces/information-property/info-person';

@Component({
  selector: 'create-person-form',
  standalone: true,
  imports: [DynamicFormsComponent],
  templateUrl: './create-person-form.component.html'
})
export class CreatePersonFormComponent implements AfterViewInit {
  /* ---- Properties ---- */
  readonly CREATE_PERSON_FORM = CREATE_PERSON_FORM;

  /* --- Injects ---- */
  createPersonService = inject(CreatePersonService);

  /* ---- Signals ---- */
  createForm = signal<FormGroup | undefined>(undefined);
  infoPerson = signal<Partial<InfoPerson | undefined>>(undefined);

  /* ---- Inputs ---- */
  enableForm = input.required<boolean>();
  sendFormValues = input.required<boolean>();

  /* ---- Outputs ---- */
  createPerson = output<boolean>();

  /* ---- Constructor ---- */
  constructor() {
    this.enableFormEffect();
    this.sendFormValuesEffect();
  }

  /* ---- Effects ---- */
  private enableFormEffect() {
    effect(() => {
      if (this.enableForm() && !this.infoPerson()){
        this.createForm()!.enable();
        return;
      }

      if (this.enableForm() && this.infoPerson()) {
        this.initForm();
        return;
      }

      this.createForm()!.disable();
    }, { allowSignalWrites: true });
  }

  private sendFormValuesEffect() {
    effect(() => {
      if (this.sendFormValues()) {
        if (this.createForm()!.invalid) {
          Swal.fire({
            icon: 'error',
            text: 'Por favor, complete todos los campos requeridos.',
            showConfirmButton: false,
            timer: 10000
          });

          this.createPerson.emit(false);
          return;
        }
        if (!this.validateForm()) {
          this.createPerson.emit(false);
          return;
        }

        this.createPersonService.setInfoPersonData(this.createForm()!.value);

        this.createPerson.emit(true);
      }
    });
  }

  ngAfterViewInit(): void {
    this.initForm();
  }

  private initForm() {
    this.infoPerson.set(this.createPersonService.infoPersonData);

    if (!this.infoPerson()?.domIndividualType) return;

    const type = this.infoPerson()?.domIndividualType;
    const naturalIndividualFieldsRequired = [
      'firstName',
      'lastName',
      'domIndividualEthnicGroup',
      'domIndividualSex'
    ];
    const naturalIndividualFields = [
      'middleName',
      'otherLastName',
      ...naturalIndividualFieldsRequired
    ];

    if (type && type === 'Persona jurídica') {
      naturalIndividualFields.forEach((field) => {
        this.createForm()!.get(field)!.clearValidators();
        if (this.infoPerson()?.domIndividualTypeNumber === 'NIT') {
          this.createForm()!.get(field)!.disable();
        }
      });
      this.createForm()!
        .get('companyName')
        ?.setValidators([Validators.required]);
      this.createForm()!.get('companyName')?.enable();
      return;
    }

    naturalIndividualFields.forEach((field) => {
      if (naturalIndividualFieldsRequired.includes(field)) {
        this.createForm()!.get(field)!.setValidators([Validators.required]);
      }
      this.createForm()!.get(field)!.enable();
    });

    this.createForm()!.get('companyName')!.clearValidators();
    this.createForm()!.get('companyName')!.disable();
  }

  private validateForm(): boolean {
    //validamos que el input de palabra
    if (this.createForm()!.get('firstName')?.value !== '') {
      const validate = this.validateSingleWord(this.createForm()!.get('firstName')?.value);
      if (validate) {
        Swal.fire({
          icon: 'error',
          title: 'El primer nombre no puede tener espacios',
          showConfirmButton: false,
          timer: 10000
        });
        return false;
      }
    }

    //validamos que el input de palabra
    if (this.createForm()!.get('lastName')?.value !== '') {
      const validate: boolean = this.validateSingleWord(
        this.createForm()!.get('lastName')?.value
      );

      if (validate) {
        Swal.fire({
          icon: 'error',
          title: 'El primer apellido no puede tener espacios',
          showConfirmButton: false,
          timer: 10000
        });
        return false;
      }
    }

    const { domIndividualTypeNumber } = this.createPersonService.infoPersonData;

    // validamos nit
    if (domIndividualTypeNumber === 'NIT') {
      const validate: boolean | null = this.validateNit(
        this.createForm()!.get('number')?.value
      );

      if (validate) {
        Swal.fire({
          icon: 'error',
          text: 'El NIT no es válido',
          showConfirmButton: false,
          timer: 10000
        });
        return false;
      }
    }

    this.createForm()!.get('companyName')?.setValue(
      this.createForm()!.get('companyName')?.value?.trim()
    );

    return true;
  }

  private validateSingleWord(value: string): boolean {
    const word = value;
    const aWord = /^\S+$/.test(word);

    return aWord ? false : true;
  }

  // validar nit
  private validateNit(nit: string): boolean {
    const word = nit;
    const aWord = /^\d{9}-\d$/.test(word);

    return aWord;
  }
}
