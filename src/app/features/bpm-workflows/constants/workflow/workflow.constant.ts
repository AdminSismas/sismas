import { JSONInput } from '@shared/interfaces/forms';
import { Validators } from '@angular/forms';

export const WORKFLOW_INPUTS: JSONInput[] = [
  {
    label: 'Categoría',
    name: 'bpmProcessCategory',
    type: 'BpmProcessCategory',
    placeholder: 'Categoría',
    validators: [Validators.required],
    element: 'collection',
    valueCode: true
  },
  {
    label: 'Nombre',
    name: 'name',
    type: 'text',
    placeholder: 'Nombre',
    validators: [Validators.required],
    element: 'input'
  },
  {
    label: 'Descripción',
    name: 'description',
    type: 'text',
    placeholder: 'Descripción',
    validators: [],
    element: 'input'
  },
  {
    label: 'Clave',
    name: 'key',
    type: 'text',
    placeholder: 'Clave',
    validators: [Validators.required],
    element: 'input'
  },
  {
    label: 'Versión',
    name: 'version',
    type: 'text',
    placeholder: 'Versión',
    validators: [Validators.required],
    element: 'input'
  },
  {
    label: 'Recurso',
    name: 'resource',
    type: 'text',
    placeholder: 'Recurso',
    validators: [],
    element: 'input'
  },
  {
    label: 'Imagen',
    name: 'image',
    type: 'text',
    placeholder: 'Imagen',
    validators: [],
    element: 'input'
  },
  {
    label: 'Válido desde',
    name: 'validBeginAt',
    element: 'date',
    type: 'past',
    placeholder: 'Válido desde',
    validators: [Validators.required],
  },
  {
    label: 'Válido hasta',
    name: 'validToAt',
    element: 'date',
    type: 'future',
    placeholder: 'Válido hasta',
    validators: [],
  },
  {
    label: 'Dias de vencimiento',
    name: 'dueDays',
    type: 'number',
    placeholder: 'Dias de vencimiento',
    validators: [Validators.required],
    element: 'input'
  },
];
