import { Validators } from "@angular/forms"
import { JSONInput } from "src/app/apps/interfaces/dynamic-forms"

export const URBAN_COLUMNS = [
  {
    name: 'zonaHomoFisicaUrCode',
    title: 'Código'
  },
  {
    name: 'domUsoSueloUrbanoTipo',
    title: 'Uso de suelo'
  },
  {
    name: 'vigencia',
    title: 'Vigencia'
  }
]

export const RURAL_COLUMNS = [
  {
    name: 'zonaHomoFisicaRuCode',
    title: 'Código'
  },
  {
    name: 'normaUsoSuelo',
    title: 'Uso de suelo'
  },
  {
    name: 'vigencia',
    title: 'Vigencia'
  }
]

export const GEOECONOMICA_COLUMNS = [
  {
    name: 'zonaHomoGeoEconomicaCode',
    title: 'Código'
  },
  {
    name: 'suelo',
    title: 'Suelo'
  },
  {
    name: 'vigencia',
    title: 'Vigencia'
  }
]

const RURAL_PARAMS: JSONInput[] = [
  {
    name: 'zonaHomoFisicaRuCode',
    label: 'Código',
    type: 'text',
    placeholder: 'Escribir código de zona',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'normaUsoSuelo',
    label: 'Norma de uso de suelo',
    type: 'text',
    placeholder: 'Escribir norma de uso de suelo',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'vigencia',
    label: 'Vigencia',
    type: 'number',
    placeholder: 'Escribir vigencia',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'domDisponibilidadAgua',
    label: 'Disponibilidad de agua',
    type: 'DisponibilidadAgua',
    placeholder: 'Seleccionar disponibilidad de agua',
    element: 'collection',
    validators: [Validators.required]
  },
  {
    name: 'domInfluenciaVialRural',
    label: 'Influencia vial',
    type: 'InfluenciaVialRural',
    placeholder: 'Seleccionar influencia vial',
    element: 'collection',
    validators: [Validators.required]
  },
  {
    name: 'domUsoSueloRural',
    label: 'Uso de suelo',
    type: 'UsoSueloRural',
    placeholder: 'Seleccionar uso de suelo',
    element: 'collection',
    validators: [Validators.required]
  },
]

const URBAN_PARAMS: JSONInput[] = [
  {
    name: 'zonaHomoFisicaUrCode',
    label: 'Código',
    type: 'text',
    placeholder: 'Escribir código de zona',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'normaUsoSuelo',
    label: 'Norma de uso de suelo',
    type: 'text',
    placeholder: 'Escribir norma de uso de suelo',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'vigencia',
    label: 'Vigencia',
    type: 'number',
    placeholder: 'Escribir vigencia',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'domTopografiaZonaTipo',
    label: 'Tipo de topografía',
    type: 'TopografiaZonaTipo',
    placeholder: 'Seleccionar tipo de topografia',
    element: 'collection',
    validators: [Validators.required]
  },
  {
    name: 'domInfluenciaVialUrbanaTipo',
    label: 'Influencia vial',
    type: 'InfluenciaVialUrbanaTipo',
    placeholder: 'Seleccionar influencia vial',
    element: 'collection',
    validators: [Validators.required]
  },
  {
    name: 'domServiciosPublicosTipo',
    label: 'Servicios públicos',
    type: 'ServiciosPublicosTipo',
    placeholder: 'Seleccionar servicios públicos',
    element: 'collection',
    validators: [Validators.required]
  },
  {
    name: 'domUsoSueloUrbanoTipo',
    label: 'Uso de suelo',
    type: 'UsoSueloUrbanoTipo',
    placeholder: 'Seleccionar uso de suelo',
    element: 'collection',
    validators: [Validators.required]
  },
  {
    name: 'domTipificacionConstruccionTipo',
    label: 'Tipo de construcción',
    type: 'TipificacionConstruccionTipo',
    placeholder: 'Seleccionar tipo de construcción',
    element: 'collection',
    validators: [Validators.required]
  },
]

const GEOECONOMIC_PARAMS: JSONInput[] = [
  {
    name: 'zonaHomoGeoEconomicaCode',
    label: 'Código',
    type: 'text',
    placeholder: 'Escribir código de zona',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'zonaHomoGeoEconomicaObs',
    label: 'Observaciones',
    type: 'text',
    placeholder: 'Escribir observaciones',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'vigencia',
    label: 'Vigencia',
    type: 'number',
    placeholder: 'Escribir vigencia',
    element: 'input',
    validators: [Validators.required]
  },
]

export const CADASTRE_CHANGE_LOG_PARAMS: JSONInput[] = [
  {
    name: 'changeLogId',
    label: 'Identificador de registro',
    type: 'number',
    placeholder: 'Escribir identificador de registro',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'resolution',
    label: 'Resolución',
    type: 'text',
    placeholder: 'Escribir resolución',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'resolutionAt',
    label: 'Fecha de resolución',
    type: 'date',
    placeholder: 'Escribir fecha de resolución',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'rooting',
    label: 'Radicado',
    type: 'text',
    placeholder: 'Escribir raíz',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'rootingAt',
    label: 'Fecha de radicación',
    type: 'date',
    placeholder: 'Escribir fecha de raíz',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'validity',
    label: 'Validez',
    type: 'number',
    placeholder: 'Escribir validez',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'beginAt',
    label: 'Fecha de inicio',
    type: 'date',
    placeholder: 'Escribir fecha de inicio',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'domCadastreChangeTypeDescription',
    label: 'Descripción',
    type: 'text',
    placeholder: 'Escribir descripción',
    element: 'input',
    validators: [Validators.required]
  },
]


export function getZoneParams(typeZone: string): JSONInput[] {
  switch (typeZone) {
    case 'rural':
      return RURAL_PARAMS

    case 'geoeconómica':
      return GEOECONOMIC_PARAMS

    default:
      return URBAN_PARAMS

  }
}
