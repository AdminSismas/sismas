export class GeoEconomicZone {
  zonaHomoGeoEconomicaId?: number;
  zonaHomoGeoEconomicaCode?: string;
  zonaHomoGeoEconomicaObs?: string;
  vigencia?: number;
  divpolLv1?: string;
  divpolLv2?: string;
  suelo?: string;
  valorLabel?: string;


  constructor(zonaHomoGeoEconomicaId: number, zonaHomoGeoEconomicaCode: string,
              zonaHomoGeoEconomicaObs: string, vigencia: number, divpolLv1: string,
              divpolLv2: string, suelo: string, valorLabel: string) {
    this.zonaHomoGeoEconomicaId = zonaHomoGeoEconomicaId;
    this.zonaHomoGeoEconomicaCode = zonaHomoGeoEconomicaCode;
    this.zonaHomoGeoEconomicaObs = zonaHomoGeoEconomicaObs;
    this.vigencia = vigencia;
    this.divpolLv1 = divpolLv1;
    this.divpolLv2 = divpolLv2;
    this.suelo = suelo;
    this.valorLabel = valorLabel;
  }
}
