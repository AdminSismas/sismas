import { GUION } from '../../../shared/constants/general/constants';

export class Sector {
  id: string;
  codigoSector: string;
  nombreSector: string;
  ccZonaPkey: string;


  constructor(content?: any) {
    this.id = content.id;
    this.codigoSector = content.codigoSector;
    this.nombreSector = content.nombreSector;
    this.ccZonaPkey = content.ccZonaPkey;
  }

  set codeName(value: string) {
  }

  get codeName(): string {
    const name = '';
    if (this.codigoSector && this.nombreSector) {
      return `${this.codigoSector}${GUION}${this.nombreSector}`;
    } else if (this.codigoSector) {
      return `${this.codigoSector}`;
    } else if (this.nombreSector) {
      return `${this.nombreSector}`;
    }
    return name;
  }
}
