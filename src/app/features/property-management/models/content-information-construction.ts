import { NAME_NO_DISPONIBLE } from '@shared/constants';
import { TypeOperation } from '@shared/interfaces';

export class ContentInformationConstruction {
  unitBuiltId?: number;
  domBuiltType?: string | null;
  domBuiltUse?: string | null;
  unitBuiltCode?: number;
  unitBuiltLabel?: string | null;
  unitBuiltFloors?: number;
  unitBuiltYear?: number;
  unitBuiltArea?: number| null;
  unitBuiltScore?: number;
  domTipologiaTipo?: string | null;
  unitBuiltValuation?: number;
  unitBuiltValuationM2?: number;
  unitBuiltPrivateArea?: number| null;
  unitBuiltObservation?: string | null;
  hash?: string | null;
  createdBy?: string | null;
  createdAt?: string | null;
  updatedBy?: string | null;
  updatedAt?: string | null;
  unitBuiltAreaE?: string | null;
  schema?:string;
  baunitId?:string;
  executionId: string | null | undefined = null;


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(content?: any, schema?:string | null, baunitId?: string | null | undefined) {
    this.unitBuiltId = content?.unitBuiltId || 0;
    this.domBuiltType = content?.domBuiltType || null;
    this.domBuiltUse = content?.domBuiltUse || null;
    this.unitBuiltCode = content?.unitBuiltCode || 0;
    this.unitBuiltLabel = content?.unitBuiltLabel || null;
    this.unitBuiltFloors = content?.unitBuiltFloors || 0;
    this.unitBuiltYear = content?.unitBuiltYear || 0;
    this.unitBuiltArea = content?.unitBuiltArea || 0;
    this.unitBuiltScore = content?.unitBuiltScore || 0;
    this.domTipologiaTipo = content?.domTipologiaTipo || null;
    this.unitBuiltValuation = content?.unitBuiltValuation || 0;
    this.unitBuiltValuationM2 = content?.unitBuiltValuationM2 || 0;
    this.unitBuiltPrivateArea = content?.unitBuiltPrivateArea || 0;
    this.unitBuiltObservation = content?.unitBuiltObservation || null;
    this.hash = content?.hash || null;
    this.createdBy = content?.createdBy || null;
    this.createdAt = content?.createdAt || null;
    this.updatedBy = content?.updatedBy || null;
    this.updatedAt = content?.updatedAt || null;
    this.unitBuiltAreaE = content?.unitBuiltAreaE || null;
    this.schema = schema || '';
    this.baunitId = baunitId || '';
  }

  get typology(): string {
    const name = `${NAME_NO_DISPONIBLE}`;
    if (this.domTipologiaTipo) {
      return `${this.domTipologiaTipo}`;
    }
    return name;
  }
}

export interface CrudInformationConstruction {
  type:TypeOperation;
  contentInformation: ContentInformationConstruction | null;
}

export interface CreateBasicInformationConstruction {
  domBuiltType?: string;
  domBuiltUse?: string;
  unitBuiltCode?: number;
  unitBuiltLabel?: string;
  unitBuiltFloors?: number;
  unitBuiltYear?: number;
  unitBuiltArea?: number;
  unitBuiltScore?: number;
  domTipologiaTipo?: string;
  unitBuiltValuation?: number;
  unitBuiltValuationM2?: number;
  unitBuiltPrivateArea?: number;
  unitBuiltObservation?: string;
  hash?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  unitBuiltAreaE?: string;
}
