import { TypeOperation } from '@shared/interfaces';

export class InformationAdjacent {
  ccColindanteBaunitId?: number;
  colindante?: string;
  domPuntoCardinal?: string;
  schema?: string;
  baUnitId?: string;
  executionId: string | null | undefined = null;


  constructor(content?: any, schema?: string | null, baUnitId?: string | null | undefined) {
    this.ccColindanteBaunitId = content?.ccColindanteBaunitId || 0;
    this.colindante = content?.colindante || '';
    this.domPuntoCardinal = content?.domPuntoCardinal || '';
    this.schema = schema || '';
    this.baUnitId = baUnitId || '';
  }

}

export interface CrudInformationAdjacent {
  type: TypeOperation;
  contentInformation: InformationAdjacent | null;
}
