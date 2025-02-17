import { GUION } from '../../constants/constant';

export class Zone {
  id: string;
  codigoZona: string;
  nombreZona: string;
  deptompio: string;


  constructor(content?: any) {
    this.id = content?.id || '';
    this.codigoZona = content?.codigoZona || '';
    this.nombreZona = content?.nombreZona || '';
    this.deptompio = content?.deptompio || '';
  }

  set codeName(value: string) {
  }

  get codeName(): string {
    const name = '';
    if (this.codigoZona && this.nombreZona) {
      return `${this.codigoZona}${GUION}${this.nombreZona}`;
    } else if (this.codigoZona) {
      return `${this.codigoZona}`;
    } else if (this.nombreZona) {
      return `${this.nombreZona}`;
    }
    return name;
  }
}
