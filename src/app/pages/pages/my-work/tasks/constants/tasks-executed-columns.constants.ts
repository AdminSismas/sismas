import { TableColumn } from "@vex/interfaces/table-column.interface";
import { TaskRetailExecuteResponseModel } from "src/app/apps/interfaces/bpm/task-retail-execute-response.model";

export const TABLE_COLUMN_PROPERTIES_EXECUTED: TableColumn<TaskRetailExecuteResponseModel>[] = [
  {
    label: 'Detalle',
    property: 'viewDetail',
    type: 'button',
    visible: true,
    cssClasses: ['text-secondary', 'font-medium']
  },

  {
    label: 'Nombre del trámite',
    property: 'processName',
    type: 'text',
    visible: true
  },
  {
    label: 'Nombre de la tarea',
    property: 'flowName',
    type: 'text',
    visible: true
  },
  {
    label: 'Fecha de inicio',
    property: 'beginAt',
    type: 'date',
    visible: true
  },
  {
    label: 'Días de retraso',
    property: 'daysFinish',
    type: 'currency',
    visible: true
  }


];