import { GUION } from '../../constants/general/constants';

export class Commune {
  id: string;
  codigoComuna: string;
  nombreComuna: string;
  sectorPkey: string;


  constructor(content?: any) {
    this.id = content.id;
    this.codigoComuna = content.codigoComuna;
    this.nombreComuna = content.nombreComuna;
    this.sectorPkey = content.sectorPkey;
  }

  set codeName(value: string) {
  }

  get codeName(): string {
    const name = '';
    if (this.codigoComuna && this.nombreComuna) {
      return `${this.codigoComuna}${GUION}${this.nombreComuna}`;
    } else if (this.codigoComuna) {
      return `${this.codigoComuna}`;
    } else if (this.nombreComuna) {
      return `${this.nombreComuna}`;
    }
    return name;
  }
}
