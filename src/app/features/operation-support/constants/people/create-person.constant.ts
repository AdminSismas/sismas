import { Validators } from '@angular/forms';
import { JSONInput } from '@shared/interfaces/forms';

export const CREATE_PERSON_FORM: JSONInput[] = [
  {
    name: 'firstName',
    label: 'Nombre',
    placeholder: 'Escribir primer nombre',
    element: 'input',
    type: 'text',
    validators: [Validators.required]
  },
  {
    name: 'middleName',
    label: 'Segundo Nombre',
    placeholder: 'Escribir segundo nombre',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'lastName',
    label: 'Apellido',
    placeholder: 'Escribir primer apellido',
    element: 'input',
    type: 'text',
    validators: [Validators.required]
  },
  {
    name: 'otherLastName',
    label: 'Segundo apellido',
    placeholder: 'Escribir segundo apellido',
    element: 'input',
    type: 'text',
    validators: []
  },
  {
    name: 'companyName',
    label: 'Nombre de la empresa',
    placeholder: 'Escribir nombre de la empresa',
    element: 'input',
    type: 'text',
    validators: [],
    cssClasses: 'col-span-full'
  },
  {
    name: 'domIndividualEthnicGroup',
    label: 'Grupo étnico',
    placeholder: 'Seleccionar grupo étnico',
    element: 'collection',
    type: 'IndividualEthnicGroup',
    validators: [Validators.required]
  },
  {
    name: 'domIndividualSex',
    label: 'Sexo',
    placeholder: 'Seleccionar sexo',
    element: 'collection',
    type: 'IndividualSex',
    validators: [Validators.required]
  },
];
