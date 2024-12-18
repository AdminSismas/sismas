import { Validators } from "@angular/forms";
import { DigitalizedSignaturesData } from "../interfaces/digitalized-signatures";
import { JSONInput } from "../interfaces/dynamic-forms";

export const DATA_SOURCE_DIGITALIZED_SIGNATURES: DigitalizedSignaturesData[] = [
  {
    fullName: 'Julian',
    description: 'El creador de la plataforma',
    type: 'SUPER-ADMIN',
    date: '2024-10-01',
    status: 'Active',
    signature: 'Firma de Julian'
  },
  {
    fullName: 'Sergio',
    description: 'Uno de los segundos al mando',
    type: 'ADMIN',
    date: '2024-10-01',
    status: 'Active',
    signature: 'Firma de Sergio'
  },
  {
    fullName: 'Maria Paula',
    description: 'Uno de los segundos al mando',
    type: 'ADMIN',
    date: '2024-10-01',
    status: 'Active',
    signature: 'Firma de Maria Paula'
  },
  {
    fullName: 'David',
    description: 'Desarrollador',
    type: 'USER',
    date: '2024-10-01',
    status: 'Active',
    signature: 'Firma de David'
  },
]

export const DIGITALIZED_SIGNATURES_COLUMNS: { name: string, title: string }[] = [
  {
    name: 'fullName',
    title: 'Usuario'
  },
  {
    name: 'date',
    title: 'Fecha'
  },
  {
    name: 'status',
    title: 'Estado'
  },
  {
    name: 'signature',
    title: 'Firma'
  }
]

export const CREATE_SIGNATURE_INPUTS: JSONInput[] = [
  {
    name: 'signature',
    label: 'Firma',
    element: 'input',
    type: 'image',
    validators: [Validators.required],
    placeholder: 'Agregar imagen de la firma',
  }
]
