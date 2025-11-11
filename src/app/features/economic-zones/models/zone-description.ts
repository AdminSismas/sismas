/* eslint-disable @typescript-eslint/no-explicit-any */
import { Observable } from "rxjs";
import { CadastralChangeLog } from '@features/property-management/models/zone-baunit';
import { JSONInput } from '@shared/interfaces/forms';
import { MatTableDataSource } from "@angular/material/table";
import { GeoEconomicZone } from '@features/property-management/models/geo-economic-zone';

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
  cadastreChangeLog?: CadastralChangeLog;
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
  cadastreChangeLog?: CadastralChangeLog;
}

export type Zone = UrbanZone | RuralZone | GeoEconomicZone;

export interface ZoneServices {
  getZones: (divpolLv1: string, divpolLv2: string) => Observable<UrbanZone[] | RuralZone[] | GeoEconomicZone[]>;
  createZone: (params: Zone) => Observable<Zone>;
  deleteZone: (version: string, id: string) => Observable<void>;
  updateZone: (params: any) => Observable<Zone>;
  getValues?: (id: string) => Observable<GeoEconomicZoneDetails>;
}

export interface CreateZoneData {
  title: string;
  inputs: JSONInput[];
  data?: Record<string, any>;
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

export interface GeoEconomicZoneDetails {
  zonaGEcoValorId: number;
  vigencia:        number;
  valor:           number;
}


