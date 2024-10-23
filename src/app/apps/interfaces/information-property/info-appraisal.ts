export class InfoAppraisal {

  valuationId?:number;
  cadastralValuationAt?:string;
  commercialValuation?:number;
  cadastralValuation?:number;
  commercialValuationLand?:number;
  cadastralValuationLand?:number;
  commercialValuationUnits?:number;
  cadastralValuationUnits?:number;
  selfValuationIs?: boolean;
  selfValuationValue?:number;
  validityValuation?:number;
  hash?:string;
  createdBy?:string;
  createdAt?:string;
  updatedBy?:string;
  updatedAt?:string;


  constructor(content?: any) {
    this.valuationId = content.valuationId;
    this.cadastralValuationAt = content.cadastralValuationAt;
    this.commercialValuation = content.commercialValuation;
    this.cadastralValuation = content.cadastralValuation;
    this.commercialValuationLand = content.commercialValuationLand;
    this.cadastralValuationLand = content.cadastralValuationLand;
    this.commercialValuationUnits = content.commercialValuationUnits;
    this.cadastralValuationUnits = content.cadastralValuationUnits;
    this.selfValuationIs = content.selfValuationIs;
    this.selfValuationValue = content.selfValuationValue;
    this.validityValuation = content.validityValuation;
    this.hash = content.hash;
    this.createdBy = content.createdBy;
    this.createdAt = content.createdAt;
    this.updatedBy = content.updatedBy;
    this.updatedAt = content.updatedAt;
  }
}
