import { JSONInput } from '@shared/interfaces/forms';
import { TableColumn } from '@vex/interfaces/table-column.interface';
import { ProcessParticipant } from '@features/bpm-workflows/models/process-participant';

export const INPUT_FORM_VISIT: JSONInput[] = [
  {
    name: 'descripcion',
    label: 'Descripción',
    placeholder: 'Escribir la descripción de la solicitud del participante',
    element: 'textarea',
    type: 'textarea',
    validators: [],
    cssClasses: 'flex flex-auto w-full h-full '
  },
  {
    name: 'docAportados',
    label: 'Documentos aportados',
    placeholder: 'Seleccionar los documentos aportados con la solicitud',
    element: 'textarea',
    type: 'textarea',
    validators: [],
    cssClasses: 'flex flex-auto w-full h-full '
  },
  {
    name: 'docCatastrales',
    label: 'Documentos catastrales',
    placeholder: 'Seleccionar los documentos catastrales',
    element: 'textarea',
    type: 'textarea',
    validators: [],
    cssClasses: 'flex flex-auto w-full h-full '
  },
  {
    name: 'observaciones',
    label: 'Observaciones',
    placeholder: 'Escribir las observaciones',
    element: 'textarea',
    type: 'textarea',
    validators: [],
    cssClasses: 'flex flex-auto w-full h-full '
  }
];

export const RES_VALIDATE_INPUTS: JSONInput[] = [
  {
    name: 'tag01',
    label: 'Tag 1',
    placeholder: 'Escribir primer tag',
    element: 'textarea',
    type: 'text',
    validators: [],
    cssClasses: 'flex flex-auto w-full h-full '
  },
  {
    name: 'tag02',
    label: 'Tag 2',
    placeholder: 'Escribir segundo tag',
    element: 'textarea',
    type: 'text',
    validators: [],
    cssClasses: 'flex flex-auto w-full h-full '
  },
  {
    name: 'tag03',
    label: 'Tag 3',
    placeholder: 'Escribir tercero tag',
    element: 'textarea',
    type: 'text',
    validators: [],
    cssClasses: 'flex flex-auto w-full h-full '
  },
  {
    name: 'tag04',
    label: 'Tag 4',
    placeholder: 'Escribir cuarto tag',
    element: 'textarea',
    type: 'text',
    validators: [],
    cssClasses: 'flex flex-auto w-full h-full '
  },
  {
    name: 'tag05',
    label: 'Tag 5',
    placeholder: 'Escribir quinto tag',
    element: 'textarea',
    type: 'text',
    validators: [],
    cssClasses: 'flex flex-auto sm:flow-row w-full h-full '
  },
  {
    name: 'tag06',
    label: 'Tag 6',
    placeholder: 'Escribir sexto tag',
    element: 'textarea',
    type: 'text',
    validators: [],
    cssClasses: 'flex flex-auto sm:flow-row w-full h-full '
  },
  {
    name: 'tag07',
    label: 'Tag 7',
    placeholder: 'Escribir septimo tag',
    element: 'textarea',
    type: 'text',
    validators: [],
    cssClasses: 'flex flex-auto sm:flow-row w-full h-full '
  },
  {
    name: 'tag08',
    label: 'Tag 8',
    placeholder: 'Escribir octavo tag',
    element: 'textarea',
    type: 'text',
    validators: [],
    cssClasses: 'flex flex-auto sm:flow-row w-full h-full '
  },
  {
    name: 'tag09',
    label: 'Tag 9',
    placeholder: 'Escribir noveno tag',
    element: 'textarea',
    type: 'text',
    validators: [],
    cssClasses: 'flex flex-auto sm:flow-row w-full h-full '
  },
  {
    name: 'tag10',
    label: 'Tag 10',
    placeholder: 'Escribir decimo tag',
    element: 'textarea',
    type: 'text',
    validators: [],
    cssClasses: 'flex flex-auto sm:flow-row w-full h-full '
  },
];

export const TABLE_COLUMN_THIRD_PARTY: TableColumn<ProcessParticipant>[] = [
  {
    label: 'Documento',
    property: 'individualNumber',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Nombre participante',
    property: 'fullName',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  },
  {
    label: 'Participación',
    property: 'bpmParticipation',
    type: 'text',
    visible: true,
    cssClasses: ['font-medium']
  }
];
