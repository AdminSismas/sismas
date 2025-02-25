import { NAME_NO, NAME_SI } from '../../constants/general/constant';

export class BasicInformationAddress {
  direccionId?: string;
  nombrePredio?: string;
  esDireccionPrincipal?: boolean| undefined;
  schema?: string;

  constructor(content?: any, schema?: string) {
    this.direccionId = content.direccionId;
    this.nombrePredio = content.nombrePredio;
    this.esDireccionPrincipal = content.esDireccionPrincipal;
    this.schema = schema;
  }

  set isMainAddress(value:boolean| undefined) {}

  get isMainAddress(): string {
    const name = `${NAME_NO}`;
    if (this.esDireccionPrincipal) {
      return `${NAME_SI}`;
    }
    return name;
  }
}
