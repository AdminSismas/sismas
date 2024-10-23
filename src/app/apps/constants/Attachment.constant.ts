import { TableColumn } from '@vex/interfaces/table-column.interface';
import { contentInfoAttachment } from '../interfaces/content-info-attachment.model';

export const PAGE: number = 0;
export const PAGE_SIZE: number = 5;
export const PAGE_SIZE_OPTION: number[] = [5, 10, 20, 50];
export const TABLE_COLUMN_PROPERTIES: TableColumn<contentInfoAttachment>[]= [
    {
        label: 'Nombre Archivo',
        property: 'originalFileName',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Peso',
        property: 'size',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Creado Por',
        property: 'createdBy',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Fecha Creación',
        property: 'createdAt',
        type: 'date',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Aprobado Por',
        property: 'aprovedBy',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Fecha Aprobación',
        property: 'aprovedAt',
        type: 'date',
        visible: true,
        cssClasses: ['font-medium']
    },
];

export const MODEL_METADATA_PROPERTIES: { label: string; metadata: keyof contentInfoAttachment; type:string }[] = [
    { 
        label: 'Nombre Archivo', 
        metadata: 'originalFileName', 
        type: 'text',
    },
    { 
        label: 'Peso', 
        metadata: 'size', 
        type: 'text',
    },
    { 
        label: 'Creado Por', 
        metadata: 'createdBy', 
        type: 'text',
    },
    { 
        label: 'Fecha Creación', 
        metadata: 'createdAt', 
        type: 'date',
    },
    { 
        label: 'Aprobado Por', 
        metadata: 'aprovedBy', 
        type: 'text',
    },
    { 
        label: 'Fecha Aprobación', 
        metadata: 'aprovedAt', 
        type: 'date',
    },
];