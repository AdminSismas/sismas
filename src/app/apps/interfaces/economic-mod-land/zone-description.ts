export interface ZoneDescription {
  baUnitZonaId:           number;
  baUnitZonaArea:         number;
  ccZonaHomoFisicaRu:     CcZonaHomoFisicaRu | null;
  ccZonaHomoFisicaUr:     CcZonaHomoFisicaUr | null;
  ccZonaHomoGeoEconomica: CcZonaHomoGeoEconomica | null;
  baUnitZonaValor:        number;
  baUnitZonaAreaE:        string;
}

export interface CcZonaHomoFisicaRu {
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

export interface CcZonaHomoFisicaUr {
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

export interface CcZonaHomoGeoEconomica {
  zonaHomoGeoEconomicaId:   number;
  zonaHomoGeoEconomicaCode: string;
  zonaHomoGeoEconomicaObs:  string;
  vigencia:                 number;
  divpolLv1:                string;
  divpolLv2:                string;
  suelo:                    string;
  valorLabel:               string;
}
