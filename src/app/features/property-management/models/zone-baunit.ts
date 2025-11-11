import { GeoEconomicZone } from '@features/property-management/models/geo-economic-zone';

export class ZoneBAUnitFisica {
  baUnitZonaType: 'Urbana' | 'Rural' | 'Geoeconomica';
  baUnitZonaId?: number;
  baUnitZonaArea?: number;
  ccZonaHomoFisicaRu?: CcZonaHomoFisica;
  zonaHomoFisicaRuCode?: string;
  ccZonaHomoFisicaUr?: CcZonaHomoFisica;
  zonaHomoFisicaUrCode?: string;
  ccZonaHomoGeoEconomica = null;
  zonaHomoGeoEconomicaCode = null;
  baUnitZonaValor?: number;
  baUnitZonaAreaE?: string;
  esComun?: boolean;
  vigencia?: number;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  baUnitZonaValorM2?: number;

  constructor( baunitZona: ZoneBAUnitResponse) {
    this.baUnitZonaType = baunitZona.ccZonaHomoFisicaRu ? 'Rural' : 'Urbana';
    this.baUnitZonaId = baunitZona.baUnitZonaId;
    this.baUnitZonaArea = baunitZona.baUnitZonaArea;
    this.ccZonaHomoFisicaRu = baunitZona.ccZonaHomoFisicaRu;
    this.zonaHomoFisicaRuCode = baunitZona.ccZonaHomoFisicaRu?.zonaHomoFisicaRuCode;
    this.ccZonaHomoFisicaUr = baunitZona.ccZonaHomoFisicaUr;
    this.zonaHomoFisicaUrCode = baunitZona.ccZonaHomoFisicaUr?.zonaHomoFisicaUrCode;
    this.baUnitZonaValor = baunitZona.baUnitZonaValor;
    this.baUnitZonaAreaE = baunitZona.baUnitZonaAreaE;
    this.esComun = baunitZona.esComun;
    this.vigencia = baunitZona.ccZonaHomoFisicaRu?.vigencia || baunitZona.ccZonaHomoFisicaUr?.vigencia || baunitZona.ccZonaHomoGeoEconomica?.vigencia;
    this.createdBy = baunitZona.createdBy;
    this.createdAt = baunitZona.createdAt;
    this.updatedBy = baunitZona.updatedBy;
    this.updatedAt = baunitZona.updatedAt;
    this.baUnitZonaValorM2 = baunitZona.baUnitZonaValorM2;
  }

}

export class ZoneBAUnitGeoeconomic {
  baUnitZonaType: 'Urbana' | 'Rural' | 'Geoeconomica';
  baUnitZonaId?: number;
  baUnitZonaArea?: number;
  ccZonaHomoFisicaRu = null;
  zonaHomoFisicaRuCode = null;
  ccZonaHomoFisicaUr = null;
  zonaHomoFisicaUrCode = null;
  ccZonaHomoGeoEconomica?: GeoEconomicZone;
  zonaHomoGeoEconomicaCode?: string;
  baUnitZonaValor?: number;
  baUnitZonaAreaE?: string;
  esComun?: boolean;
  vigencia?: number;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  zonaValid: boolean;
  baUnitZonaValorM2?: number;

  constructor( baunitZona: ZoneBAUnitResponse) {
    this.baUnitZonaType = 'Geoeconomica';
    this.baUnitZonaId = baunitZona.baUnitZonaId;
    this.baUnitZonaArea = baunitZona.baUnitZonaArea;
    this.ccZonaHomoGeoEconomica = baunitZona.ccZonaHomoGeoEconomica;
    this.zonaHomoGeoEconomicaCode = baunitZona.ccZonaHomoGeoEconomica?.zonaHomoGeoEconomicaCode;
    this.baUnitZonaValor = baunitZona.baUnitZonaValor;
    this.baUnitZonaAreaE = baunitZona.baUnitZonaAreaE;
    this.esComun = baunitZona.esComun;
    this.vigencia = baunitZona.ccZonaHomoGeoEconomica?.vigencia;
    this.createdBy = baunitZona.createdBy;
    this.createdAt = baunitZona.createdAt;
    this.updatedBy = baunitZona.updatedBy;
    this.updatedAt = baunitZona.updatedAt;
    this.zonaValid = baunitZona.zonaValid ?? false;
    this.baUnitZonaValorM2 = baunitZona.baUnitZonaValorM2 ?? 0;
  }
}

export interface AddZoneParameters {
  zone?: ZoneBAUnitFisica | ZoneBAUnitGeoeconomic;
  baunitId: number;
  isEdit: boolean;
  executionId: string;
  propertyType: string;
  divpolLv1?: string;
  divpolLv2?: string;
  npn?: string;
}

export interface ZoneBAUnitResponse {
  baUnitZonaId:           number;
  baUnitZonaArea:         number;
  ccZonaHomoFisicaRu:     CcZonaHomoFisica;
  ccZonaHomoFisicaUr:     CcZonaHomoFisica;
  ccZonaHomoGeoEconomica: CcZonaHomoGeoEconomica;
  baUnitZonaValor:        number;
  esComun:                boolean;
  hash:                   string;
  createdBy:              string;
  createdAt:              string;
  updatedBy:              string;
  updatedAt:              string;
  baUnitZonaAreaE?:       string;
  zonaValid?:             boolean;
  baUnitZonaValorM2?:      number;
}

export interface CcZonaHomoFisica {
  zonaHomoFisicaUrId?:             number;
  zonaHomoFisicaRuId?:             number;
  zonaHomoFisicaUrCode?:           string;
  zonaHomoFisicaRuCode?:           string;
  domTopografiaZonaTipo:           string;
  domInfluenciaVialUrbanaTipo?:    string;
  domInfluenciaVialRural?:         string;
  domServiciosPublicosTipo:        string;
  domUsoSueloUrbanoTipo?:          string;
  domUsoSueloRuralTipo?:           string;
  domDisponibilidadAgua?:          string;
  normaUsoSuelo:                   string;
  domTipificacionConstruccionTipo: string;
  vigencia:                        number;
  cadastreChangeLog:               CadastralChangeLog;
  divpolLv1:                       string;
  divpolLv2:                       string;
}

export interface CadastralChangeLog {
  changeLogId:                      number;
  resolution:                       string;
  resolutionAt:                     Date;
  rooting:                          string;
  rootingAt:                        Date;
  validity:                         number;
  beginAt:                          Date;
  domCadastreChangeTypeDescription: string;
}

// Generated by https://quicktype.io

export interface CcZonaHomoGeoEconomica {
  zonaHomoGeoEconomicaId:   number;
  zonaHomoGeoEconomicaCode: string;
  zonaHomoGeoEconomicaObs:  string;
  vigencia:                 number;
  cadastreChangeLog:        CadastralChangeLog;
}

export interface CreateBaunitZone {
  baUnitZonaId?: number;
  baUnitZonaArea?: number;
  esComun?: boolean;
  ccZonaHomoFisicaRu?: CcZonaHomoFisica | null;
  ccZonaHomoFisicaUr?: CcZonaHomoFisica | null;
  ccZonaHomoGeoEconomica?: CcZonaHomoGeoEconomica | null;
}
