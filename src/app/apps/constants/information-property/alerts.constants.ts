import { TableColumn } from '@vex/interfaces/table-column.interface';
import { AlertResponse, EstadoProceso } from '@features/property-management/models';
import { JSONInput } from '@shared/interfaces';
import { Validators } from '@angular/forms';

export const ALERT_TABLE_COLUMNS: TableColumn<AlertResponse>[] = [
  {
    label: 'Detalle',
    property: 'viewDetail',
    type: 'button',
    visible: true
  },
  {
    label: 'Tipo',
    property: 'domAlertType',
    type: 'text',
    visible: true
  },
  {
    label: 'Estado',
    property: 'alertState',
    type: 'text',
    visible: true
  },
  {
    label: 'Responsable',
    property: 'alertEntityResponsible',
    type: 'text',
    visible: true
  },
  {
    label: 'Fecha inicio',
    property: 'alertStartAt',
    type: 'date',
    visible: true
  },
  {
    label: 'Fecha fin',
    property: 'alertFinishAt',
    type: 'date',
    visible: true
  },
  {
    label: 'Acciones',
    property: 'actions',
    type: 'operationType',
    visible: true
  }
];

export const formAlertCreateInputsJson: JSONInput[] = [
  {
    name: 'domAlertType',
    label: 'Tipo de alerta',
    placeholder: 'Seleccione el tipo de alerta',
    element: 'collection',
    type: 'AlertType',
    validators: [Validators.required],
    cssClasses: 'w-full h-full min-h-2'
  },
  {
    name: 'alertAnotation',
    label: 'Anotaciones',
    placeholder: 'Agregue las anotaciones de la alerta',
    element: 'textarea',
    type: 'text',
    validators: [],
    cssClasses: 'w-full h-full !m-0 min-h-2'
  }
];

export const formAlertUpdateInputsJson: JSONInput[] = [
  {
    name: 'domAlertType',
    label: 'Tipo de alerta',
    placeholder: 'Seleccione el tipo de alerta',
    element: 'collection',
    type: 'AlertType',
    validators: [Validators.required],
    cssClasses: 'w-full h-fit'
  },
  {
    name: 'alertState',
    label: 'Estado de alerta',
    placeholder: 'Seleccione el estado de la alerta',
    element: 'select',
    type: 'AlertType',
    options: Object.values(EstadoProceso).map((estado) => ({
      value: estado,
      label: estado.charAt(0).toUpperCase() + estado.slice(1).toLowerCase()
    })),
    validators: [Validators.required],
    cssClasses: 'w-full h-fit'
  },
  {
    name: 'alertEntityResponsible',
    label: 'Entidad responsable',
    placeholder: 'Escribir la entidad responsable',
    element: 'input',
    type: 'text',
    validators: [Validators.required],
    cssClasses: 'w-full h-fit'
  },
  {
    name: 'alertAnotation',
    label: 'Anotaciones',
    placeholder: 'Agregue las anotaciones de la alerta',
    element: 'textarea',
    type: 'text',
    validators: [],
    cssClasses: 'w-full h-full !m-0 col-span-3'
  }
];
