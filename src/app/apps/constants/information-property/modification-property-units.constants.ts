import { TableColumn } from '@vex/interfaces/table-column.interface';
import { BaUnitHeadPercentage } from '@shared/interfaces';


export const TABLE_COLUMN_UNITS_TABLE_COLUMNS: TableColumn<BaUnitHeadPercentage>[] = [
  {
    label: '',
    property: 'viewMap',
    type: 'button',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Matrícula inmobiliaria',
    property: 'registration',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Número predial',
    property: 'cadastralNumber',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Área terreno',
    property: 'cadastralAreaE',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Condición',
    property: 'domBaunitCondition',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Destino económico',
    property: 'domBaunitEconoDesti',
    type: 'text',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },
  {
    label: 'Coeficiente',
    property: 'percentageGroup',
    type: 'percentage',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  }
];

export const MODIFYCATION_UNITS_TABLE_COLUMNS: TableColumn<BaUnitHeadPercentage>[] = [
  {
    label: '',
    property: 'operationType',
    type: 'operationType',
    visible: true,
    cssClasses: []
  },
  {
    label: 'Ficha',
    property: 'baunitIdE',
    type: 'text',
    visible: true,
    cssClasses: []
  },
  ...TABLE_COLUMN_UNITS_TABLE_COLUMNS,
  {
    label: 'Acciones',
    property: 'actions',
    type: 'button',
    visible: true
  }
];


