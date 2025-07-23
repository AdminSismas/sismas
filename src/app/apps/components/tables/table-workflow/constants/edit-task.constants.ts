import { Validators } from "@angular/forms";
import { JSONInput } from "src/app/apps/interfaces/forms/dynamic-forms";

export const editTaskInputs: JSONInput[] = [
  {
    label: 'Nombre',
    name: 'name',
    type: 'text',
    validators: [Validators.required],
    placeholder: 'Ingrese el nombre',
    element: 'input'
  },
  {
    label: 'Grupo de usuarios',
    name: 'bpmLaneNames',
    type: 'text',
    validators: [Validators.required],
    placeholder: 'Ingrese el nombre',
    element: 'input'
  },
  {
    label: 'Orden de tarea',
    name: 'orderFlow',
    type: 'text',
    validators: [Validators.required, Validators.pattern('^[0-9]*$')],
    placeholder: 'Ingrese el orden de la tarea',
    element: 'input'
  },
  {
    label: 'Página',
    name: 'preformId',
    type: 'select',
    validators: [Validators.required],
    placeholder: 'Seleccione la página',
    element: 'select',
    options: [],
    cssClasses: 'col-span-2 w-full'
  },
  {
    label: '¿Tiene pregunta?',
    name: 'haveQuestion',
    type: 'boolean',
    validators: [Validators.required],
    placeholder: '¿Tiene pregunta?',
    element: 'checkbox',
    cssClasses: 'text-center'
  },
  {
    label: 'Pregunta',
    name: 'question',
    type: 'text',
    validators: [],
    placeholder: 'Ingrese la pregunta',
    element: 'textarea',
    cssClasses: 'col-span-2'
  },
  {
    label: 'Orden de pregunta',
    name: 'questionFlow',
    type: 'text',
    validators: [Validators.pattern('^[0-9]*$')],
    placeholder: 'Ingrese el orden de la pregunta',
    element: 'input'
  }
];
