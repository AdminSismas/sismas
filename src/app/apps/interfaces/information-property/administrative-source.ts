export interface AdministrativeSource {
  fuenteAdminId: string;
  domFuenteAdministrativaTipo: string;
  fechaDocumentoFuente: string | Date;
  numeroFuente: string;
  domEnteEmisor: string;
  oficinaOrigen: string;
  ciudadOrigen: string;
  departamentoOrigen?: string;
  hash: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
}

export interface CreateAdministrativeSourceParams {
  executionId: string;
  baunitId: string;
  administrativeSource: CreateAdministrativeSource;
}

export interface CreateAdministrativeSource {
  domFuenteAdministrativaTipo: string;
  fechaDocumentoFuente: string;
  numeroFuente: string;
  domEnteEmisor: string;
  oficinaOrigen: string;
  departamentoOrigen: string;
  ciudadOrigen: string;
}

export interface FuentesAdministrativasTipo {
  domainId:    number;
  domainName:  string;
  code:        string;
  inactive:    boolean;
  dispname:    string;
  description: string;
}

export interface UpdateAdministrativeSource {
  executionId: string;
  baunitId: string;
  params: UpdateAdministrativeSourceParams;
}

export interface UpdateAdministrativeSourceParams {
  fuenteAdminId: string;
  domFuenteAdministrativaTipo: string;
  fechaDocumentoFuente: Date | string;
  numeroFuente: string;
  domEnteEmisor: string;
  oficinaOrigen: string;
  departamentoOrigen: string;
  ciudadOrigen: string;
}

export interface DeleteAdministrativeSourceParams {
  baunitId: string;
  changeLogId: string;
  fuenteAdminId: string;
}
