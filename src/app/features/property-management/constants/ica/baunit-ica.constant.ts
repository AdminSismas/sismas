import { TableColumn } from '@vex/interfaces/table-column.interface';
import { IcaTable } from '@shared/interfaces';

export const TABLE_ICA_COLUMNS: TableColumn<IcaTable>[] = [
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
  {
    property: 'actions',
    label: 'Acciones',
    visible: true,
    type: 'button'
  },
];

export const ICA_MENU_ITEMS = [
  {
    id: '1',
    icon: 'mat:visibility',
    label: 'Ver detalles',
  },
  {
    id: '2',
    icon: 'mat:photo',
    label: 'Fotos',
  }
];
