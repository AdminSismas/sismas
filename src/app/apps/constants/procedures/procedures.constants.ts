import { TableColumn } from "@vex/interfaces/table-column.interface";
import { User } from "../../interfaces/users/user";

export const TABLE_REASSIGN_PROCEDURE: TableColumn<User>[] = [
  {
    label: 'Nombre de usuario',
    property: 'username',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Nombre',
    property: 'fullName',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Correo',
    property: 'email',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  }
];
