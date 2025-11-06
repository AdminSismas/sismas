export interface AlertResponse {
  alertBaunitId: string;
  domAlertType: string;
  alertState: string;
  alertEntityResponsible: string;
  alertStartAt: Date;
  alertFinishAt: null;
  alertAnotation: null;
}

export enum EstadoProceso {
  ACTIVO = 'ACTIVO', // Proceso normal
  REVISION = 'REVISION', // Proceso normal
  CERRADO = 'CERRADO', // Proceso normal
  ANULADO = 'ANULADO', // Es una que se considero pero se cerro por que era un error
  TEMPORAL = 'TEMPORAL' //Es cuando tiene fecha de finalizacion desde el inicio
}
