import { JSONInput } from '@shared/interfaces/forms';
import { AbstractControl, ValidatorFn, ValidationErrors } from '@angular/forms';

// Validators directos sin instanciar el servicio
const emailValidator = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value) return null;

    const emailPattern =
      /^[a-zA-Z0-9._%+-áéíóúÁÉÍÓÚñÑüÜ]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    const valid = emailPattern.test(control.value);
    return valid ? null : { invalidEmail: true };
  };
};

const min03Characters = (): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const value: any = control.value;
    if (
      value !== null &&
      value !== undefined &&
      value !== '' &&
      value.length > 0 &&
      value.length < 3
    ) {
      return { min03Characters: true };
    }
    return null;
  };
};

export const CREATE_CONTACT_FORM: JSONInput[] = [
  {
    name: 'divpolLv1',
    label: 'Departamento',
    placeholder: 'Seleccione el departamento',
    element: 'select',
    type: 'text',
    options: [],
    validators: [],
    cssClasses: 'w-full'
  },
  {
    name: 'divpolLv2',
    label: 'Municipio',
    placeholder: 'Seleccione el municipio',
    element: 'select',
    type: 'text',
    options: [],
    validators: [],
    cssClasses: 'w-full'
  },
  {
    name: 'phoneNumber',
    label: 'Número de teléfono',
    placeholder: 'Ingrese el número de teléfono',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'email',
    label: 'Correo electrónico',
    placeholder: 'Ingrese el correo electrónico',
    element: 'input',
    type: 'text',
    validators: [emailValidator()]
  },
  {
    name: 'address',
    label: 'Dirección',
    placeholder: 'Ingrese la dirección',
    element: 'input',
    type: 'text',
    validators: [min03Characters()]
  }
];
