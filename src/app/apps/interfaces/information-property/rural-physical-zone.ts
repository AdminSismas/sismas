export class RuralPhysicalZone {
  zonaHomoFisicaRuId?:number;
  zonaHomoFisicaRuCode?:number;
  domDisponibilidadAgua?:number;
  domInfluenciaVialRural?:number;
  domUsoSueloRural?:number;
  normaUsoSuelo?:number;
  vigencia?:number;
  divpolLv1?:number;
  divpolLv2?:number;


  constructor(zonaHomoFisicaRuId: number, zonaHomoFisicaRuCode: number,
              domDisponibilidadAgua: number, domInfluenciaVialRural: number,
              domUsoSueloRural: number, normaUsoSuelo: number, vigencia: number,
              divpolLv1: number, divpolLv2: number) {
    this.zonaHomoFisicaRuId = zonaHomoFisicaRuId;
    this.zonaHomoFisicaRuCode = zonaHomoFisicaRuCode;
    this.domDisponibilidadAgua = domDisponibilidadAgua;
    this.domInfluenciaVialRural = domInfluenciaVialRural;
    this.domUsoSueloRural = domUsoSueloRural;
    this.normaUsoSuelo = normaUsoSuelo;
    this.vigencia = vigencia;
    this.divpolLv1 = divpolLv1;
    this.divpolLv2 = divpolLv2;
  }
}
