import { TableColumn } from '@vex/interfaces/table-column.interface';
import { IcaTable } from '@shared/interfaces';

export const TABLE_ICA_COLUMNS: TableColumn<IcaTable>[] = [
  {
    property: 'details',
    label: 'Detalles',
    visible: true,
    type: 'button'
  },
  {
    property: 'nombreEstablecimiento',
    label: 'Nombre Establecimiento',
    visible: true,
    type: 'text'
  },
  {
    property: 'domActividadPrincipal',
    label: 'Actividad Principal',
    visible: true,
    type: 'text'
  },
  {
    property: 'domActividadSecundaria',
    label: 'Actividad Secundaria',
    visible: true,
    type: 'text'
  },
];
