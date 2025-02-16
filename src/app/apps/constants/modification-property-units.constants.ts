import { TableColumn } from '@vex/interfaces/table-column.interface';
import { Operation } from '../interfaces/bpm/operation';

export const TABLE_COLUMNS: TableColumn<Operation>[] = [
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
    label: '',
    property: 'empty-row',
    type: 'empty-row',
    visible: false,
    cssClasses: ['text-secondary', 'font-medium']
  },
  { 
    label: 'Acciones',
    property: 'actions',
    type: 'button',
    visible: true
  }
];
