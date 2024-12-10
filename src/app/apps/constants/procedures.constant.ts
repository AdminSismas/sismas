import { TableColumn } from "@vex/interfaces/table-column.interface";
import { contentInfoProcedures } from "../interfaces/content-info-procedures.model";

export const PAGE: number = 0;
export const PAGE_SIZE: number = 10;
export const PAGE_SIZE_OPTION: number[] = [5, 10, 20, 50];
export const TABLE_COLUMN_PROPERTIES: TableColumn<contentInfoProcedures>[]= [
    {
        label: 'Detalle',
        property: 'detailDirection',
        type: 'button',
        visible: true,
        cssClasses: ['text-secondary']
      },
    {
        label: 'Radicado',
        property: 'executionCode',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
   
    {
        label: 'Clase',
        property: 'bpmProcessCategory',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Nombre',
        property: 'processName',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Actualizado',
        property: 'lastUpdateAt',
        type: 'date',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Suspendido',
        property: 'suspendedDays',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Plazo',
        property: 'dueDate',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
]


import { MatDateFormats, MAT_DATE_FORMATS } from '@angular/material/core';

export const MY_DATE_FORMATS: MatDateFormats = {
    parse: {
        dateInput: 'DD/MM/YYYY',
    },
    display: {
        dateInput: 'DD/MM/YYYY',
        monthYearLabel: 'MMM YYYY',
        dateA11yLabel: 'DD/MM/YYYY',
        monthYearA11yLabel: 'MMMM YYYY',
    },
};
