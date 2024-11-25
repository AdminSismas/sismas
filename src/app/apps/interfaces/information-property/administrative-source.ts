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
