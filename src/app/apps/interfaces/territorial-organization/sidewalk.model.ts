import { GUION } from '../../constants/general/constants';

export class Sidewalk {
  id: string;
  codigoVereda: string;
  nombreVereda: string;
  sectorPkey: string;


  constructor(content?: any) {
    this.id = content.id;
    this.codigoVereda = content.codigoVereda;
    this.nombreVereda = content.nombreVereda;
    this.sectorPkey = content.sectorPkey;
  }

  set codeName(value: string) {
  }

  get codeName(): string {
    const name = '';
    if (this.codigoVereda && this.nombreVereda) {
      return `${this.codigoVereda}${GUION}${this.nombreVereda}`;
    } else if (this.codigoVereda) {
      return `${this.codigoVereda}`;
    } else if (this.nombreVereda) {
      return `${this.nombreVereda}`;
    }
    return name;
  }
}
