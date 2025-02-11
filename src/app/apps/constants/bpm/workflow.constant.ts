import { TableColumn } from '@vex/interfaces/table-column.interface';
import { contentInfoWorkflow } from '../../interfaces/general/content-info-workflow.model';
import { JSONInput } from '../../interfaces/forms/dynamic-forms';
import { Validators } from '@angular/forms';

export const PAGE = 0;
export const PAGE_SIZE = 10;
export const PAGE_SIZE_OPTION: number[] = [5, 10, 20, 50];
export const TABLE_COLUMN_PROPERTIES: TableColumn<contentInfoWorkflow>[]= [
    {
        label: 'Clave',
        property: 'key',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Nombre',
        property: 'name',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Descripción',
        property: 'description',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Categoría',
        property: 'bpmProcessCategory',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Versión',
        property: 'version',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Válido hasta',
        property: 'validToAt',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Días de vencimiento',
        property: 'dueDays',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
];

const workflow: any = {
  "processId": 1,
  "bpmProcessCategory": "M_PRIMERA",
  "name": "Cambio de propietario",
  "description": "Las que ocurran respecto del cambio de propietario, poseedor u ocupante y no afecta el avalúo catastral.",
  "key": "PRC_001",
  "version": "1",
  "resource": null,
  "image": "https://elasticbeanstalk-us-east-1-243227624769.s3.amazonaws.com/images/AspectoJuridico.png",
  "validBeginAt": "2023-01-11",
  "validToAt": "2026-07-12",
  "dueDays": 5,
  "icon": "camb_juridico_01.png"
};

export const WORKFLOW_INPUTS: JSONInput[] = [
  {
    label: 'Categoría',
    name: 'bpmProcessCategory',
    type: 'BpmProcessCategory',
    placeholder: 'Categoría',
    validators: [Validators.required],
    element: 'collection'
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
