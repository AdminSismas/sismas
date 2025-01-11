import { Validators } from "@angular/forms";
import { JSONInput } from "../interfaces/dynamic-forms";

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
    name: 'username',
    label: 'Nombre de usuario',
    element: 'input',
    type: 'text',
    validators: [Validators.required],
    placeholder: 'Escribe el nombre de usuario'
  },
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
