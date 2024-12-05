import { Observable } from "rxjs";
import { JSONInput } from "../dynamic-forms";

export interface UrbanZone {
  zonaHomoFisicaUrId:              number;
  zonaHomoFisicaUrCode:            string;
  domTopografiaZonaTipo:           string;
  domInfluenciaVialUrbanaTipo:     string;
  domServiciosPublicosTipo:        string;
  domUsoSueloUrbanoTipo:           string;
  normaUsoSuelo:                   string;
  domTipificacionConstruccionTipo: string;
  vigencia:                        number;
  divpolLv1:                       string;
  divpolLv2:                       string;
}

export interface RuralZone {
  zonaHomoFisicaRuId:     number;
  zonaHomoFisicaRuCode:   string;
  domDisponibilidadAgua:  string;
  domInfluenciaVialRural: string;
  domUsoSueloRural:       string;
  normaUsoSuelo:          string;
  vigencia:               number;
  divpolLv1:              string;
  divpolLv2:              string;
}

export interface GeoEconomicZone {
  zonaHomoGeoEconomicaId:   number;
  zonaHomoGeoEconomicaCode: string;
  zonaHomoGeoEconomicaObs:  string;
  vigencia:                 number;
  divpolLv1:                string;
  divpolLv2:                string;
  suelo:                    string;
  valorLabel:               string;
}

export type Zone = UrbanZone | RuralZone | GeoEconomicZone;

export interface ZoneServices {
  getZones: (divpolLv1: string, divpolLv2: string) => Observable<UrbanZone[] | RuralZone[] | GeoEconomicZone[]>;
  createZone: (params: Zone) => Observable<Zone>;
}

export interface CreateZoneData {
  params: CreateZoneParams;
  inputs: JSONInput[];
}

interface CreateZoneParams {
  title: string;
  divpolLv1: string;
  divpolLv2: string;
}
