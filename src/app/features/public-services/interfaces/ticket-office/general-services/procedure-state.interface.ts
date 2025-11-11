export interface ProcedureStateResponse {
  id: string;
  status: ProcedureState;
  formattedStatus?: ProcedureStateEnum;
  filePath: string;
  paymentReference: string;
  errorMessage: string;
  createdAt: string;
  downloadedAt: string;
}

export type ProcedureState =
  | 'PENDING'
  | 'PROCESSING'
  | 'COMPLETED'
  | 'FAILED'
  | 'DOWNLOADED';

export enum ProcedureStateEnum {
  PENDING = 'Pendiente',
  PROCESSING = 'Procesando',
  COMPLETED = 'Completado',
  FAILED = 'Fallido',
  DOWNLOADED = 'Descargado'
}
