import { Validators } from "@angular/forms";
import { JSONInput } from "../../interfaces/forms/dynamic-forms";
import { TableColumn } from "@vex/interfaces/table-column.interface";
import { ProcessParticipant } from "../../interfaces/bpm/process-participant";

export const INPUT_FORM_VISIT: JSONInput[] = [
    {
        name: 'description',
        label: 'Descripción',
        placeholder: 'Escribir la descripción de la solicitud del participante',
        element: 'input',
        type: 'textarea',
        validators: [Validators.required],
    },
    {
        name: 'addDocuments',
        label: 'Documentos aportados',
        placeholder: 'Seleccionar los documentos aportados con la solicitud',
        element: 'input',
        type: 'text',
        validators: [Validators.required],
    },
    {
        name: 'cadastralDocuments',
        label: 'Documentos catastrales',
        placeholder: 'Seleccionar los documentos catastrales',
        element: 'input',
        type: 'text',
        validators: [Validators.required],
    },
    {
        name: 'observations',
        label: 'Observaciones',
        placeholder: 'Escribir las observaciones',
        element: 'input',
        type: 'textarea',
        validators: [Validators.required],
    },
    {
        name: 'thirdPartyAffected',
        label: 'Terceros afectados',
        placeholder: '',
        element: 'toggle',
        type: 'before',
        validators: [],
    }
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
