import { Validators } from "@angular/forms";
import { JSONInput } from '@shared/interfaces/forms';


export const DIGITALIZED_SIGNATURES_COLUMNS: { name: string, title: string }[] = [
  {
    name: 'username',
    title: 'Usuario'
  },
  {
    name: 'validToAt',
    title: 'Fecha'
  },
  {
    name: 'role',
    title: 'Rol'
  },
  {
    name: 'enabled',
    title: 'Estado'
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

export const CREATE_SIGNATURE_INPUTS: JSONInput[] = [
  {
    name: 'signature',
    label: 'Firma',
    element: 'file',
    type: '.png',
    validators: [Validators.required],
    placeholder: 'Agregar imagen de la firma',
  }
];
