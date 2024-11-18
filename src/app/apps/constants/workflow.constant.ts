import { TableColumn } from '@vex/interfaces/table-column.interface';
import { contentInfoWorkflow } from '../interfaces/content-info-workflow.model';

export const PAGE: number = 0;
export const PAGE_SIZE: number = 10;
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
    }
]
