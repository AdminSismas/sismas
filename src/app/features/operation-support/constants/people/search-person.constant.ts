import { Validators } from "@angular/forms";
import { JSONInput } from '@shared/interfaces/forms';

export const SEARCH_PERSON_FORM: JSONInput[] = [
  {
    name: 'domIndividualType',
    label: 'Tipo de persona',
    placeholder: 'Buscar por tipo de persona',
    element: 'collection',
    type: 'IndividualType',
    validators: [Validators.required]
  },
  {
    name: 'domIndividualTypeNumber',
    label: 'Número de tipo de individuo',
    placeholder: 'Buscar por número de tipo de individuo',
    element: 'collection',
    type: 'IndividualTypeNumber',
    validators: [Validators.required]
  },
  {
    name: 'number',
    label: 'Número',
    placeholder: 'Buscar por número',
    element: 'input',
    type: 'text',
    validators: [Validators.required]
  }
];

// {
//   domIndividualTypeNumber: [this.defaults?.domIndividualTypeNumber ?? ''],
//   number: [this.defaults?.number ?? ''],
//   domIndividualType: [
//     this.defaults?.domIndividualType ?? '',
//     Validators.required
//   ],
// };
