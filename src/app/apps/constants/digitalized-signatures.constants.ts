import { DigitalizedSignaturesData } from "../interfaces/digitalized-signatures";

export const DATA_SOURCE_DIGITALIZED_SIGNATURES: DigitalizedSignaturesData[] = [
  {
    fullName: 'Julian',
    description: 'El creador de la plataforma',
    type: 'SUPER-ADMIN',
    date: '2024-10-01',
    status: 'Active'
  },
  {
    fullName: 'Sergio',
    description: 'Uno de los segundos al mando',
    type: 'ADMIN',
    date: '2024-10-01',
    status: 'Active'
  },
  {
    fullName: 'Maria Paula',
    description: 'Uno de los segundos al mando',
    type: 'ADMIN',
    date: '2024-10-01',
    status: 'Active'
  },
  {
    fullName: 'David',
    description: 'Desarrollador',
    type: 'USER',
    date: '2024-10-01',
    status: 'Active'
  },
]

export const DIGITALIZED_SIGNATURES_DISPLAY_COLUMNS: string[] = [
  'fullName',
  'description',
  'type',
  'date',
  'status',
  'actions'
]

export const DIGITALIZED_SIGNATURES_COLUMNS: { name: string, title: string }[] = [
  {
    name: 'fullName',
    title: 'Nombre'
  },
  {
    name: 'description',
    title: 'Descripción'
  },
  {
    name: 'type',
    title: 'Tipo'
  },
  {
    name: 'date',
    title: 'Fecha'
  },
  {
    name: 'status',
    title: 'Estado'
  },
]
