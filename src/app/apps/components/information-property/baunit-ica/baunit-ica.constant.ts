import { TableColumn } from '@vex/interfaces/table-column.interface';
import { IcaTable } from 'src/app/apps/components/information-property/baunit-ica/interfaces/ica-table';

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
