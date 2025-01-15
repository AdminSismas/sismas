import { Validators } from "@angular/forms";
import { JSONInput } from "../interfaces/dynamic-forms";
import { TableColumn } from "@vex/interfaces/table-column.interface";
import { AdministrativeSource } from "../interfaces/information-property/administrative-source";

export const INPUTS_ADMINISTRATIVE_SOURCE: JSONInput[] = [
  {
    name: 'domFuenteAdministrativaTipo',
    label: 'Tipo fuente administrativa',
    placeholder: 'Tipo fuente administrativa',
    element: 'collection',
    type: 'FuenteAdministrativaTipo',
    validators: [Validators.required],
  },
  {
    name: 'numeroFuente',
    label: 'Número fuente',
    placeholder: 'Número fuente',
    element: 'input',
    type: 'string',
    validators: [Validators.required],
  },
  {
    name: 'cateEnteEmisor',
    label: 'Categoría ente emisor',
    placeholder: 'Escribir categoría de ente emisor',
    element: 'select',
    type: 'string',
    validators: [Validators.required],
    options: ['Notaría', 'Registraduría', 'Otro']
  },
  {
    name: 'tipoEnteEmisor',
    label: 'Tipo ente emisor',
    placeholder: 'Escribir tipo de ente emisor',
    element: 'input',
    type: 'string',
    validators: [Validators.required],
  },
  {
    name: 'fechaDocumentoFuente',
    label: 'Fecha de documento',
    placeholder: 'Fecha de documento',
    element: 'input',
    type: 'date',
    validators: [Validators.required],
  },
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
  }
];
