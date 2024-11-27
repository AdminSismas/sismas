export interface AdministrativeSource {
  fuenteAdminId:               number;
  domFuenteAdministrativaTipo: string;
  fechaDocumentoFuente:        Date | string;
  numeroFuente:                string;
  enteEmisor:                  string;
  hash:                        string;
  createdBy:                   string;
  createdAt:                   Date | string;
  updatedBy:                   string;
  updatedAt:                   Date | string;
}

export interface CreateAdministrativeSourceParams {
  executionId: string;
  baunitId: string;
  administrativeSource: CreateAdministrativeSource;
}

export interface CreateAdministrativeSource {
  domFuenteAdministrativaTipo?: string;
  fechaDocumentoFuente?:        Date | string;
  numeroFuente?:                string;
  enteEmisor?:                  string;
}

export interface FuentesAdministrativasTipo {
  domainId:    number;
  domainName:  string;
  code:        string;
  inactive:    boolean;
  dispname:    string;
  description: string;
}
