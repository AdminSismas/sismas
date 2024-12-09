import { Validators } from "@angular/forms";
import { JSONInput } from "../interfaces/dynamic-forms";

export const SEARCH_INPUTS: JSONInput[] = [
  {
    name: 'individualTypeNumber',
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
]

export const CREATE_USER_INPUTS: JSONInput[] = [
  {
    name: 'username',
    label: 'Usuario',
    element: 'input',
    type: 'text',
    validators: [Validators.required],
    placeholder: 'Escribir nombre de usuario'
  },
  {
    name: 'email',
    label: 'Correo electrónico',
    element: 'input',
    type: 'text',
    validators: [Validators.required, Validators.email],
    placeholder: 'Escribir correo electrónico'
  }
]
