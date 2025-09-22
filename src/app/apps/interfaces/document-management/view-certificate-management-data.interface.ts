export interface DataViewCertificate {
  number: string;
  domIndividualTypeNumber: string;
  individualNameNoExist: string;
  templateCode: string;
  baunitId: string | null;
}

export interface ViewCertificateManagementData {
  baunitId: number | null;
  templateCode: TemplateCodes;
  number?: string;
  domIndividualTypeNumber?: string;
  individualNameNoExist?: string;
  title?: string;
}

export type TemplateCodes = 'CERT_POSEER_BIEN_TAQUILLA' | 'CERT_FICHA_AVALUO' | 'CERT_PLANO_PREDIAL_CATASTRAL' | 'CERT_INST_PUBL';

export interface SendRequestProcedureData extends ViewCertificateManagementData {
  paymentReference: string;
}

export enum ProceduresNames {
  CERT_POSEER_BIEN_TAQUILLA = 'Certificado de Poseer Bien en Taquilla',
  CERT_FICHA_AVALUO = 'Certificado de Ficha de Avalúo',
  CERT_PLANO_PREDIAL_CATASTRAL = 'Certificado de Plano Predial Catastral',
  CERT_INST_PUBL = 'Certificado de Institución Pública'
}