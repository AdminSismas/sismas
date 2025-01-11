import { Validators } from "@angular/forms";
import { JSONInput } from "../interfaces/dynamic-forms";


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
