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
    name: 'valorLabel',
    title: 'Valor'
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
    name: 'changeLogId',
    label: 'Historial de cambios',
    type: 'text',
    placeholder: 'Escribir historial de cambios',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'divpolLv1',
    label: 'Departamento',
    type: 'text',
    placeholder: 'Escribir departamento',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'divpolLv2',
    label: 'Municipio',
    type: 'text',
    placeholder: 'Escribir municipio',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'domDisponibilidadAgua',
    label: 'Disponibilidad de agua',
    type: 'DisponibilidadAguaTipo',
    placeholder: 'Seleccionar disponibilidad de agua',
    element: 'collection',
    validators: [Validators.required]
  },
  {
    name: 'domInfluenciaVialRural',
    label: 'Influencia vial',
    type: 'InfluenciaVialRuralTipo',
    placeholder: 'Seleccionar influencia vial',
    element: 'collection',
    validators: [Validators.required]
  },
  {
    name: 'domUsoSueloRural',
    label: 'Uso de suelo',
    type: 'UsoSueloRuralTipo',
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
    name: 'changeLogId',
    label: 'Historial de cambios',
    type: 'text',
    placeholder: 'Escribir historial de cambios',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'divpolLv1',
    label: 'Departamento',
    type: 'text',
    placeholder: 'Escribir departamento',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'divpolLv2',
    label: 'Municipio',
    type: 'text',
    placeholder: 'Escribir municipio',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'fkTopografiaZonaTipo',
    label: 'Tipo de topografía',
    type: 'TopografiaZonaTipo',
    placeholder: 'Seleccionar tipo de topografia',
    element: 'collection',
    validators: [Validators.required]
  },
  {
    name: 'fkInfluenciaVialUrbanaTipo',
    label: 'Influencia vial',
    type: 'InfluenciaVialUrbanaTipo',
    placeholder: 'Seleccionar influencia vial',
    element: 'collection',
    validators: [Validators.required]
  },
  {
    name: 'fkServiciosPublicosTipo',
    label: 'Servicios públicos',
    type: 'ServiciosPublicosTipo',
    placeholder: 'Seleccionar servicios públicos',
    element: 'collection',
    validators: [Validators.required]
  },
  {
    name: 'fkUsoSueloUrbanoTipo',
    label: 'Uso de suelo',
    type: 'UsoSueloUrbanoTipo',
    placeholder: 'Seleccionar uso de suelo',
    element: 'collection',
    validators: [Validators.required]
  },
  {
    name: 'fkTipificacionConstruccionTipo',
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
  {
    name: 'changeLogId',
    label: 'Historial de cambios',
    type: 'text',
    placeholder: 'Escribir historial de cambios',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'divpolLv1',
    label: 'Departamento',
    type: 'text',
    placeholder: 'Escribir departamento',
    element: 'input',
    validators: [Validators.required]
  },
  {
    name: 'divpolLv2',
    label: 'Municipio',
    type: 'text',
    placeholder: 'Escribir municipio',
    element: 'input',
    validators: [Validators.required]
  }
]

export function getZoneParams(typeZone: string): JSONInput[] {
  switch (typeZone) {
    case 'rurales':
      return RURAL_PARAMS

    case 'geoeconómicas':
      return GEOECONOMIC_PARAMS

    default:
      return URBAN_PARAMS

  }
}
