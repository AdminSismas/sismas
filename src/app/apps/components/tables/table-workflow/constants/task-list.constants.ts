import { TableColumn } from "@vex/interfaces/table-column.interface";
import { Proflow } from '@shared/interfaces';


export const taskListColumns: TableColumn<Proflow>[] = [
  {
    label: 'Nombre',
    property: 'name',
    type: 'text',
    visible: true,
  },
  {
    label: 'Página',
    property: 'preform.name',
    type: 'text',
    visible: true,
  },
  {
    label: 'Grupo de usuarios',
    property: 'bpmLaneNames',
    type: 'text',
    visible: true,
  },
  {
    label: 'Tiene pregunta',
    property: 'question',
    type: 'text',
    visible: true,
  },
  {
    label: 'Orden de tarea',
    property: 'orderFlow',
    type: 'text',
    visible: true,
  }
];
