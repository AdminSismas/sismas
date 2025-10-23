import { IcaResponse } from '@shared/components';

export class IcaDetails {
  prediador: string;
  accion: string;
  domIndividualType: string;
  domIndividualTypeNumber: string;
  nombresPersona: string;
  apellidosPersona: string;
  direccionResidencia: string;
  nombreEstablecimiento: string;
  domicilioNotificacion: string;
  telefono: string;
  email: string;
  notificacionElectronica: string;
  escritura: string;
  ciudadCamara: string;
  matricula: string;
  fechaMatricula: Date;
  fechaInicioActividades: Date;
  regimenTributario: string;
  estadoRegistroMercantil: string;
  granContribuyente: string;
  domActividadPrincipal: string;
  domActividadSecundaria: string;
  inscritoCc: string;

  constructor(icaResponse: IcaResponse) {
    this.prediador = icaResponse.prediador ?? '';
    this.accion = icaResponse.accion ?? '';
    this.domIndividualType = icaResponse.domIndividualType ?? '';
    this.domIndividualTypeNumber = icaResponse.domIndividualTypeNumber ?? '';
    this.nombresPersona = `${icaResponse.primerNombre} ${icaResponse.segundoNombre}`.trim();
    this.apellidosPersona = `${icaResponse.primerApellido} ${icaResponse.segundoApellido}`.trim();
    this.direccionResidencia = icaResponse.direccionResidencia ?? ''  ;
    this.nombreEstablecimiento = icaResponse.nombreEstablecimiento ?? '';
    this.domicilioNotificacion = icaResponse.domicilioNotificacion ?? '';
    this.telefono = icaResponse.telefono ?? '';
    this.email = icaResponse.email ?? '';
    this.notificacionElectronica = icaResponse.notificacionElectronica ?? '';
    this.escritura = icaResponse.escritura ?? '';
    this.ciudadCamara = icaResponse.ciudadCamara ?? '';
    this.matricula = icaResponse.matricula ?? '';
    this.fechaMatricula = icaResponse.fechaMatricula ?? new Date();
    this.fechaInicioActividades = icaResponse.fechaInicioActividades ?? new Date();
    this.regimenTributario = icaResponse.regimenTributario ?? '';
    this.estadoRegistroMercantil = icaResponse.estadoRegistroMercantil ?? '';
    this.granContribuyente = icaResponse.granContribuyente ?? '';
    this.domActividadPrincipal = icaResponse.domActividadPrincipal ?? '';
    this.domActividadSecundaria = icaResponse.domActividadSecundaria ?? '';
    this.inscritoCc = icaResponse.inscritoCc ?? '';
  }

  static mapToIcaDetails(icaResponse: IcaResponse): IcaDetails {
    return new IcaDetails(icaResponse);
  }
}
