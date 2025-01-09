import { NAME_NO_DISPONIBLE } from '../../constants/constant';

export class ContentInformationConstruction {
  unitBuiltId?: number;
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
  schema?:string;
  baunitId?:string;


  constructor(content?: any,schema?:string, baunitId?: string) {
    this.unitBuiltId = content.unitBuiltId;
    this.domBuiltType = content.domBuiltType;
    this.domBuiltUse = content.domBuiltUse;
    this.unitBuiltCode = content.unitBuiltCode;
    this.unitBuiltLabel = content.unitBuiltLabel;
    this.unitBuiltFloors = content.unitBuiltFloors;
    this.unitBuiltYear = content.unitBuiltYear;
    this.unitBuiltArea = content.unitBuiltArea;
    this.unitBuiltScore = content.unitBuiltScore;
    this.domTipologiaTipo = content.domTipologiaTipo;
    this.unitBuiltValuation = content.unitBuiltValuation;
    this.unitBuiltValuationM2 = content.unitBuiltValuationM2;
    this.unitBuiltPrivateArea = content.unitBuiltPrivateArea;
    this.unitBuiltObservation = content.unitBuiltObservation;
    this.hash = content.hash;
    this.createdBy = content.createdBy;
    this.createdAt = content.createdAt;
    this.updatedBy = content.updatedBy;
    this.updatedAt = content.updatedAt;
    this.unitBuiltAreaE = content.unitBuiltAreaE;
    this.schema = schema;
    this.baunitId = baunitId;
  }

  set typology(value:string) {}

  get typology(): string {
    const name = `${NAME_NO_DISPONIBLE}`;
    if (this.domTipologiaTipo) {
      return `${this.domTipologiaTipo}`;
    }
    return name;
  }
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
