import { NAME_NO, NAME_SI } from '../../constants/general/constants';

export class BasicInformationAddress {
  baunitId?: string | null;
  executionId?: string | null;
  direccionId?: string;
  nombrePredio?: string;
  esDireccionPrincipal?: boolean;
  schema?: string;

  constructor(content?: any, schema?: string) {
    this.baunitId = content?.baunitId || '';
    this.executionId = content?.executionId || '';
    this.direccionId = content?.direccionId || '';
    this.nombrePredio = content?.nombrePredio || '';
    this.esDireccionPrincipal = content?.esDireccionPrincipal || '';
    this.schema = schema || '';
  }

  get isMainAddress(): string {
    const name = `${NAME_NO}`;
    if (this.esDireccionPrincipal) {
      return `${NAME_SI}`;
    }
    return name;
  }
}
