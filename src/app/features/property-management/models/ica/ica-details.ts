import { IcaResponse } from '@shared/interfaces';

export class IcaDetails {
  domIndividualType: string;
  domIndividualTypeNumber: string;
  nombresPersona: string;
  apellidosPersona: string;
  direccionResidencia: string;
  nombreEstablecimiento: string;
  domicilioNotificacion: string;
  telefono: string;
  email: string;
  notificacionElectronica: boolean;
  escritura: string;
  ciudadCamara: string;
  matricula: string;
  fechaMatricula: Date;
  fechaInicioActividades: Date;
  regimenTributario: string;
  estadoRegistroMercantil: string;
  granContribuyente: boolean;
  domActividadPrincipal: string;
  domActividadSecundaria: string;
  inscritoCc: boolean;

  constructor(icaResponse: IcaResponse) {
    this.domIndividualType = icaResponse.domIndividualType ?? '';
    this.domIndividualTypeNumber = icaResponse.domIndividualTypeNumber ?? '';
    this.nombresPersona =
      `${icaResponse.primerNombre} ${icaResponse.segundoNombre}`.trim();
    this.apellidosPersona =
      `${icaResponse.primerApellido} ${icaResponse.segundoApellido}`.trim();
    this.direccionResidencia = icaResponse.direccionResidencia ?? '';
    this.nombreEstablecimiento = icaResponse.nombreEstablecimiento ?? '';
    this.domicilioNotificacion = icaResponse.domicilioNotificacion ?? '';
    this.telefono = icaResponse.telefono ?? '';
    this.email = icaResponse.email ?? '';
    this.notificacionElectronica = icaResponse.notificacionElectronica ?? false;
    this.escritura = icaResponse.escritura ?? '';
    this.ciudadCamara = icaResponse.ciudadCamara ?? '';
    this.matricula = icaResponse.matricula ?? '';
    this.fechaMatricula = icaResponse.fechaMatricula ?? new Date();
    this.fechaInicioActividades =
      icaResponse.fechaInicioActividades ?? new Date();
    this.regimenTributario = icaResponse.regimenTributario ?? '';
    this.estadoRegistroMercantil = icaResponse.estadoRegistroMercantil ?? '';
    this.granContribuyente = icaResponse.granContribuyente ?? false;
    this.domActividadPrincipal = icaResponse.domActividadPrincipal ?? '';
    this.domActividadSecundaria = icaResponse.domActividadSecundaria ?? '';
    this.inscritoCc = icaResponse.inscritoCc ?? false;
  }

  static mapToIcaDetails(icaResponse: IcaResponse): IcaDetails {
    return new IcaDetails(icaResponse);
  }
}
