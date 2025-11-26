import { IcaResponse } from '@shared/interfaces';

export class IcaTable {
  prIcaId: number;
  nombreEstablecimiento: string | null;
  domActividadPrincipal: string | null;
  domActividadSecundaria: string | null;
  municipalityCode: string;

  constructor(icaResponse: IcaResponse) {
    this.prIcaId = icaResponse.prIcaId;
    this.nombreEstablecimiento = icaResponse.nombreEstablecimiento ?? null;
    this.domActividadPrincipal = icaResponse.domActividadPrincipal ?? null;
    this.domActividadSecundaria = icaResponse.domActividadSecundaria ?? null;
    this.municipalityCode = this.getMunicipalityCode(icaResponse.npnFormat);
  }

  static mapToIcaTable(icaResponse: IcaResponse): IcaTable {
    return new IcaTable(icaResponse);
  }

  static mapToIcaTableList(icaResponseList: IcaResponse[]): IcaTable[] {
    return icaResponseList.map(IcaTable.mapToIcaTable);
  }

  private getMunicipalityCode(icaResponse: string): string {
    return icaResponse.split('-')[1];
  }
}
