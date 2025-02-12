import { RuralPhysicalZone } from './rural-physical-zone';
import { UrbanPhysicalZone } from './urban-physical-zone';
import { GeoEconomicZone } from './geo-economic-zone';

export interface ZoneBAUnit {
  baUnitZonaId?: number;
  baUnitZonaArea?: number;
  ccZonaHomoFisicaRu?: RuralPhysicalZone;
  ccZonaHomoFisicaUr?: UrbanPhysicalZone;
  ccZonaHomoGeoEconomica?: GeoEconomicZone;
  baUnitZonaValor?: number;
  baUnitZonaAreaE?: string;
  esComun?: string;

}

export interface AddZoneParameters {
  zone: ZoneBAUnit;
  baunitId: number;
  isEdit: boolean;
  propertyType: string;
  divpolLv1: string;
  divpolLv2: string;
}
