import { Validators } from "@angular/forms";
import { JSONInput } from "../interfaces/dynamic-forms";

export const INPUTS_ADMINISTRATIVE_SOURCE: JSONInput[] = [
  {
    name: 'domFuenteAdministrativaTipo',
    label: 'Tipo fuente administrativa',
    placeholder: 'Tipo fuente administrativa',
    element: 'collection',
    type: 'FuenteAdministrativaTipo',
    validators: [Validators.required],
  },
  {
    name: 'numeroFuente',
    label: 'Número fuente',
    placeholder: 'Número fuente',
    element: 'input',
    type: 'string',
    validators: [Validators.required],
  },
  {
    name: 'cateEnteEmisor',
    label: 'Categoría ente emisor',
    placeholder: 'Escribir categoría de ente emisor',
    element: 'select',
    type: 'string',
    validators: [Validators.required],
    options: ['Notaría', 'Registraduría', 'Otro']
  },
  {
    name: 'tipoEnteEmisor',
    label: 'Tipo ente emisor',
    placeholder: 'Escribir tipo de ente emisor',
    element: 'input',
    type: 'string',
    validators: [Validators.required],
  },
  {
    name: 'fechaDocumentoFuente',
    label: 'Fecha de documento',
    placeholder: 'Fecha de documento',
    element: 'input',
    type: 'date',
    validators: [Validators.required],
  },
];
