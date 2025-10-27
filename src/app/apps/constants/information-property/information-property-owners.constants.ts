import { TableColumn } from "@vex/interfaces/table-column.interface";
import { InfoOwnerRowT } from 'src/app/apps/components/information-property/information-property-owners/information-property-owners.component';

export const FRACTION_DECIMALS = 2;
export const TABLE_COLUMNS: TableColumn<InfoOwnerRowT>[] = [
    {
      label: 'Detalle',
      property: 'viewDetail',
      type: 'button',
      visible: true
    },
    {
      label: 'Tipo documento',
      property: 'domIndividualTypeNumber',
      type: 'text',
      visible: true
    },
    {
      label: 'Número',
      property: 'number',
      type: 'text',
      visible: true
    },
    {
      label: 'Nombre completo',
      property: 'fullName',
      type: 'text',
      visible: true
    },
    {
      label: 'Fracción',
      property: 'fractionS',
      type: 'text',
      visible: true
    },
    {
      label: 'Tipo derecho',
      property: 'domRightType',
      type: 'text',
      visible: true
    },
    {
      label: 'Inicio de tenencia',
      property: 'beginAt',
      type: 'text',
      visible: true
    },
    {
      label: 'Acciones',
      property: 'actions',
      type: 'button',
      visible: true
    }
  ];
