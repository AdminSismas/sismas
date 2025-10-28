import { TypeOperationAlfaMain } from '@shared/interfaces';
import { Operation } from '@shared/interfaces';

export class DataAlfaMain {
  executionId?: string;
  typeOperation?: TypeOperationAlfaMain | null;
  addNpnLike?: string;
  bAunitCondition?: string;
  domIndividualTypeNumber?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  otherLastName?: string;
  companyName?: string;
  textAddress?: string;
  department?: string | undefined | null;
  municipality?: string | undefined | null;
  zone?: string | undefined | null;
  sector?: string | null | undefined;
  community?: string | null | undefined;
  neighborhood?: string | null | undefined;
  block?: string | null | undefined;
  sidewalk?: string | null | undefined;
  operationBaUnitHead?: Operation | null | undefined;

  constructor(
    executionId: string,
    typeOperation: TypeOperationAlfaMain,
    content?: any
  ) {
    this.executionId = executionId || '';
    this.typeOperation = typeOperation || null;
    this.addNpnLike = content?.addNpnLike?.trim() || '';
    this.bAunitCondition = content?.bAunitCondition?.trim() || '';
  }
}

export interface ModificationUnitProperties {
  executionId: string;
  baunitIdE: string;
  npnMatrix: string;
  resources: string[];
  operationBaUnitHead: Operation
}
