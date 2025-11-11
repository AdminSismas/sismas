import { TableColumn } from '@vex/interfaces/table-column.interface';
import { contentInfoAttachment } from '@features/bpm-workflows/models/document-management/content-info-attachment.model';

export const TABLE_COLUMN_ATTACHMENT: TableColumn<contentInfoAttachment>[]= [
    {
        label: 'Nombre archivo',
        property: 'originalFileName',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
      label: 'Tipo',
      property: 'attachmentType',
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
        label: 'Creado por',
        property: 'createdBy',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Fecha creación',
        property: 'createdAt',
        type: 'date',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Aprobado por',
        property: 'aprovedBy',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Fecha aprobación',
        property: 'aprovedAt',
        type: 'date',
        visible: true,
        cssClasses: ['font-medium']
    },
];

export const TABLE_COLUMN_ATTACHMENT_DOCUMENT_VALIDATE: TableColumn<contentInfoAttachment>[]= [
    {
        label: 'Nombre archivo',
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
        label: 'Creado por',
        property: 'createdBy',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Fecha creación',
        property: 'createdAt',
        type: 'date',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Aprobado por',
        property: 'aprovedBy',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Fecha aprobación',
        property: 'aprovedAt',
        type: 'date',
        visible: true,
        cssClasses: ['font-medium']
    }
];



export const MODEL_METADATA_PROPERTIES: { label: string; metadata: keyof contentInfoAttachment; type:string }[] = [
    {
        label: 'Nombre archivo',
        metadata: 'originalFileName',
        type: 'text',
    },
    {
        label: 'Peso',
        metadata: 'size',
        type: 'text',
    },
    {
        label: 'Creado por',
        metadata: 'createdBy',
        type: 'text',
    },
    {
        label: 'Fecha creación',
        metadata: 'createdAt',
        type: 'date',
    },
    {
        label: 'Aprobado por',
        metadata: 'aprovedBy',
        type: 'text',
    },
    {
        label: 'Fecha aprobación',
        metadata: 'aprovedAt',
        type: 'date',
    },
];
