import { IcaResponse } from "./baunit-ica.interface";

export class IcaTable {
  prIcaId: number;
  nombreEstablecimiento: string | null;
  domActividadPrincipal: string | null;
  domActividadSecundaria: string | null;

  constructor(icaResponse: IcaResponse) {
    this.prIcaId = icaResponse.prIcaId;
    this.nombreEstablecimiento = icaResponse.nombreEstablecimiento;
    this.domActividadPrincipal = icaResponse.domActividadPrincipal;
    this.domActividadSecundaria = icaResponse.domActividadSecundaria;
  }

  static mapToIcaTable(icaResponse: IcaResponse): IcaTable {
    return new IcaTable(icaResponse);
  }

  static mapToIcaTableList(icaResponseList: IcaResponse[]): IcaTable[] {
    return icaResponseList.map(IcaTable.mapToIcaTable);
  }
}
