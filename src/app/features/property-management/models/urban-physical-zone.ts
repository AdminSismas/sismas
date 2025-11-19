export class UrbanPhysicalZone {

  zonaHomoFisicaUrId?:number;
  zonaHomoFisicaUrCode?:string;
  domTopografiaZonaTipo?:string;
  domInfluenciaVialUrbanaTipo?:string;
  domServiciosPublicosTipo?:string;
  domUsoSueloUrbanoTipo?:string;
  normaUsoSuelo?:string;
  domTipificacionConstruccionTipo?:string;
  vigencia?:number;
  divpolLv1?:string;
  divpolLv2?:string;


  constructor(zonaHomoFisicaUrId: number, zonaHomoFisicaUrCode: string,
              domTopografiaZonaTipo: string, domInfluenciaVialUrbanaTipo: string,
              domServiciosPublicosTipo: string, domUsoSueloUrbanoTipo: string,
              normaUsoSuelo: string, domTipificacionConstruccionTipo: string,
              vigencia: number, divpolLv1: string, divpolLv2: string) {
    this.zonaHomoFisicaUrId = zonaHomoFisicaUrId;
    this.zonaHomoFisicaUrCode = zonaHomoFisicaUrCode;
    this.domTopografiaZonaTipo = domTopografiaZonaTipo;
    this.domInfluenciaVialUrbanaTipo = domInfluenciaVialUrbanaTipo;
    this.domServiciosPublicosTipo = domServiciosPublicosTipo;
    this.domUsoSueloUrbanoTipo = domUsoSueloUrbanoTipo;
    this.normaUsoSuelo = normaUsoSuelo;
    this.domTipificacionConstruccionTipo = domTipificacionConstruccionTipo;
    this.vigencia = vigencia;
    this.divpolLv1 = divpolLv1;
    this.divpolLv2 = divpolLv2;
  }
}
