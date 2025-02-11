import { contentInfoDomainLadmCol } from '../../interfaces/general/content-info-domainLadmCol.model';
import { TableColumn } from '@vex/interfaces/table-column.interface';

export const PAGE = 0;
export const PAGE_SIZE = 10;
export const PAGE_SIZE_OPTION: number[] = [5, 10, 20, 50];
export const TABLE_COLUMN_PROPERTIES: TableColumn<contentInfoDomainLadmCol>[]= [
    {
        label: 'Dominio',
        property: 'domainName',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Código',
        property: 'domainCode',
        type: 'text',
        visible: true,
        cssClasses: ['font-medium']
    },
    {
        label: 'Nombre',
        property: 'dispName',
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
    }
];
