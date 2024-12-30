import { GUION } from '../../constants/constant';

export class Neighborhood {
  id: string;
  codigoBarrio: string;
  nombreBarrio: string;
  comunaPkey: string;


  constructor(content?: any) {
    this.id = content.id;
    this.codigoBarrio = content.codigoBarrio;
    this.nombreBarrio = content.nombreBarrio;
    this.comunaPkey = content.comunaPkey;
  }

  set codeName(value: string) {
  }

  get codeName(): string {
    const name = '';
    if (this.codigoBarrio && this.nombreBarrio) {
      return `${this.codigoBarrio}${GUION}${this.nombreBarrio}`;
    } else if (this.codigoBarrio) {
      return `${this.codigoBarrio}`;
    } else if (this.nombreBarrio) {
      return `${this.nombreBarrio}`;
    }
    return name;
  }
}
