import { TableColumn } from '@vex/interfaces/table-column.interface';
import { contentInfoProcedures } from '../../interfaces/general/content-info-procedures.model';

export const PAGE = 0;
export const PAGE_SIZE = 10;
export const PAGE_SIZE_OPTION: number[] = [5, 10, 20, 50];
export const USERS_ACTIONS_ENABLED = ['ADMIN', 'USER_LEAD'];
export const TABLE_COLUMN_PROPERTIES: TableColumn<contentInfoProcedures>[] = [
  {
    label: '',
    property: 'detailInfoProcedures',
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
  {
    label: 'Acciones',
    property: 'actions',
    type: 'operationType',
    visible: true,
    cssClasses: ['font-medium']
  }
];
export const TABLE_COLUMN_PROPERTIES_HISTORY: TableColumn<contentInfoProcedures>[] = [
  {
    label: '',
    property: 'detailHistoricalActiveProcedures',
    type: 'button',
    visible: true,
    cssClasses: ['text-secondary']
  },
  {
    label: 'Versión',
    property: 'executionId',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
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
  }
];


export const TABLE_COLUMN_PROPERTIES_FINISHED: TableColumn<contentInfoProcedures>[] = [

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
  }
];


import { MatDateFormats } from '@angular/material/core';

export const MY_DATE_FORMATS: MatDateFormats = {
  parse: {
    dateInput: 'DD/MM/YYYY'
  },
  display: {
    dateInput: 'DD/MM/YYYY',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'DD/MM/YYYY',
    monthYearA11yLabel: 'MMMM YYYY'
  }
};
