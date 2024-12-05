import { Observable } from "rxjs";
import { JSONInput } from "../dynamic-forms";
import { MatTableDataSource } from "@angular/material/table";

export interface UrbanZone {
  zonaHomoFisicaUrId: number;
  zonaHomoFisicaUrCode: string;
  domTopografiaZonaTipo: string;
  domInfluenciaVialUrbanaTipo: string;
  domServiciosPublicosTipo: string;
  domUsoSueloUrbanoTipo: string;
  normaUsoSuelo: string;
  domTipificacionConstruccionTipo: string;
  vigencia: number;
  divpolLv1: string;
  divpolLv2: string;
}

export interface RuralZone {
  zonaHomoFisicaRuId: number;
  zonaHomoFisicaRuCode: string;
  domDisponibilidadAgua: string;
  domInfluenciaVialRural: string;
  domUsoSueloRural: string;
  normaUsoSuelo: string;
  vigencia: number;
  divpolLv1: string;
  divpolLv2: string;
}

export interface GeoEconomicZone {
  zonaHomoGeoEconomicaId: number;
  zonaHomoGeoEconomicaCode: string;
  zonaHomoGeoEconomicaObs: string;
  vigencia: number;
  divpolLv1: string;
  divpolLv2: string;
  suelo: string;
  valorLabel: string;
}

export type Zone = UrbanZone | RuralZone | GeoEconomicZone;

export interface ZoneServices {
  getZones: (divpolLv1: string, divpolLv2: string) => Observable<UrbanZone[] | RuralZone[] | GeoEconomicZone[]>;
  createZone: (params: Zone) => Observable<Zone>;
  deleteZone: (version: string, id: string) => Observable<void>;
  updateZone: (params: Zone) => Observable<Zone>;
}

export interface CreateZoneData {
  params: CreateZoneParams;
  inputs: JSONInput[];
  data?: { [key: string]: any };
}

interface CreateZoneParams {
  title: string;
  divpolLv1: string;
  divpolLv2: string;
}

export interface DataSourceZoneManager {
  urban: MatTableDataSource<UrbanZone>;
  rural: MatTableDataSource<RuralZone>;
  geoeconomic: MatTableDataSource<GeoEconomicZone>
}

export interface Columns {
  urban: { name: string, title: string }[];
  rural: { name: string, title: string }[];
  geoeconomic: { name: string, title: string }[];
}

export interface DisplayedColumns {
  urban: string[];
  rural: string[];
  geoeconomic: string[];
}
