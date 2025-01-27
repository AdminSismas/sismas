import { Validators } from "@angular/forms";
import { JSONInput } from "../interfaces/dynamic-forms";
import { TableColumn } from "@vex/interfaces/table-column.interface";
import { AdministrativeSource } from "../interfaces/information-property/administrative-source";
import { GeneralValidationsService } from "../services/validations/general-validations.service";

const generalValidationsService = new GeneralValidationsService();

export const INPUTS_ADMINISTRATIVE_SOURCE: JSONInput[] = [
  {
    name: 'domFuenteAdministrativaTipo',
    label: 'Tipo fuente administrativa',
    placeholder: 'Tipo fuente administrativa',
    element: 'collection',
    type: 'FuenteAdministrativaTipo',
    validators: [Validators.required],
    cssClasses: 'col-span-2'
  },
  {
    name: 'fechaDocumentoFuente',
    label: 'Fecha de documento',
    placeholder: 'Fecha de documento',
    element: 'date',
    type: 'past',
    validators: [Validators.required, generalValidationsService.maxDateValidator()],
    cssClasses: 'col-span-2'
  },
  {
    name: 'numeroFuente',
    label: 'Número fuente',
    placeholder: 'Número fuente',
    element: 'input',
    type: 'string',
    validators: [Validators.required],
    cssClasses: 'col-span-2'
  },
  {
    name: 'domEnteEmisor',
    label: 'Ente emisor',
    placeholder: 'Seleccionar el ente emisor',
    element: 'collection',
    type: 'EnteEmisor',
    validators: [Validators.required],
    cssClasses: 'col-span-3'
  },
  {
    name: 'oficinaOrigen',
    label: 'Oficina',
    placeholder: 'Escribir tipo de ente emisor',
    element: 'input',
    type: 'string',
    validators: [Validators.required],
    cssClasses: 'col-span-3'
  },
  {
    name: 'departamentoOrigen',
    label: 'Departamento',
    placeholder: 'Seleccionar departamento',
    element: 'select',
    type: 'string',
    options: [],
    validators: [Validators.required],
    cssClasses: 'col-span-3'
  },
  {
    name: 'ciudadOrigen',
    label: 'Ciudad',
    placeholder: 'Seleccionar ciudad',
    element: 'select',
    type: 'string',
    options: [],
    validators: [Validators.required],
    cssClasses: 'col-span-3'
  }
];

export const COLUMNS_ADMINISTRATIVE_SOURCES: TableColumn<AdministrativeSource>[] = [
  {
    label: 'Tipo fuente administrativa',
    property: 'domFuenteAdministrativaTipo',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Fecha',
    property: 'fechaDocumentoFuente',
    type: 'date',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Número',
    property: 'numeroFuente',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Ente emisor',
    property: 'domEnteEmisor',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Oficina',
    property: 'oficinaOrigen',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Ciudad de origen',
    property: 'ciudadOrigen',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Acciones',
    property: 'actions',
    type: 'button',
    visible: true
  }
];
