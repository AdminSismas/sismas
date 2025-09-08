import { JSONInput } from 'src/app/apps/interfaces/forms/dynamic-forms';
import { GeneralValidationsService } from 'src/app/apps/services/validations/general-validations.service';

const generalValidationsService = new GeneralValidationsService();

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
    validators: [],
  },
  {
    name: 'email',
    label: 'Correo electrónico',
    placeholder: 'Ingrese el correo electrónico',
    element: 'input',
    type: 'text',
    validators: [generalValidationsService.emailValidator()]
  },
  {
    name: 'address',
    label: 'Dirección',
    placeholder: 'Ingrese la dirección',
    element: 'input',
    type: 'text',
    validators: [generalValidationsService.min03Characters()]
  }
];
