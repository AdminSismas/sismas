import { Validators } from "@angular/forms";
import { JSONInput } from '@shared/interfaces/forms';

export const USER_COLUMNS: { name: string; label: string }[] = [
  {
    name: 'fullName',
    label: 'Nombre'
  },
  {
    name: 'username',
    label: 'Usuario',
  },
  {
    name: 'email',
    label: 'Correo electrónico',
  },
  {
    name: 'role',
    label: 'Rol',
  },
  {
    name: 'enabled',
    label: 'Estado',
  }
];

export const SEARCH_INPUTS: JSONInput[] = [
  {
    name: 'domIndividualTypeNumber',
    label: 'Tipo de documento',
    element: 'collection',
    type: 'IndividualTypeNumber',
    validators: [Validators.required],
    placeholder: 'Seleccionar tipo de documento'
  },
  {
    name: 'number',
    label: 'Número de documento',
    element: 'input',
    type: 'text',
    validators: [Validators.required],
    placeholder: 'Número de documento'
  }
];

export const CREATE_USER_INPUTS: JSONInput[] = [
  {
    name: 'email',
    label: 'Correo electrónico',
    element: 'input',
    type: 'text',
    validators: [Validators.required, Validators.email],
    placeholder: 'Escribir correo electrónico'
  }
];
