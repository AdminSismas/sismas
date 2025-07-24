import { TableColumn } from '@vex/interfaces/table-column.interface';
import { Individual, User } from 'src/app/apps/interfaces/users/user';

export const groupMemberColumns: TableColumn<Individual & Partial<User>>[] = [
  {
    label: 'Nombre',
    property: 'fullName',
    type: 'text',
    visible: true
  },
  {
    label: 'Usuario',
    property: 'username',
    type: 'text',
    visible: true
  },
  {
    label: 'Tipo de documento',
    property: 'domIndividualTypeNumber',
    type: 'text',
    visible: true
  },
  {
    label: 'Número de documento',
    property: 'number',
    type: 'text',
    visible: true
  },
  {
    label: 'Correo electrónico',
    property: 'email',
    type: 'text',
    visible: true
  },
  {
    label: 'Rol',
    property: 'role',
    type: 'text',
    visible: true
  }
];
