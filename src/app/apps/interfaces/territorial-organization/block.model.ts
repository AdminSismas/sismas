import { GUION } from '../../constants/constant';

export class Block {
  id: string;
  codigoManzana: string;
  nombreManzana: string;
  barrioPkey: string;


  constructor(content?: any) {
    this.id = content.id;
    this.codigoManzana = content.codigoManzana;
    this.nombreManzana = content.nombreManzana;
    this.barrioPkey = content.barrioPkey;
  }

  set codeName(value: string) {
  }

  get codeName(): string {
    const name = '';
    if (this.codigoManzana && this.nombreManzana) {
      return `${this.codigoManzana}${GUION}${this.nombreManzana}`;
    } else if (this.codigoManzana) {
      return `${this.codigoManzana}`;
    } else if (this.nombreManzana) {
      return `${this.nombreManzana}`;
    }
    return name;
  }
}
