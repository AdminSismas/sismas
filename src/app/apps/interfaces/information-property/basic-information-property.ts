export class BasicInformationProperty {
  propertyRegistryOffice?: string;
  propertyRegistryNumber?: string;
  propertyRegistryArea?: string;
  cadastralArea?: string;
  cadastralNumber?: string;
  cadastralLastNumber?: string;
  cadastralRegistryNumberTemp?: string;
  cadlAreaCommonE?: string;
  cadAreaPrivateE?: string;
  cadastralAreaUnitbuilt?: string;
  cadAreaUnitbuiltCommon?: string;
  cadAreaUnitbuiltPrivate?: string;
  
  cadastralRegistryNumber?: string;
  cadastralCreatedAt?: string;
  domBaunitType?: string;
  domBaunitCondition?: string;
  domBaunitEconoDesti?: string;
  domBaunitProcessType?: string;
  cadastralLastMasiveEventAt?: string;
  cadastralLastMasiveEventCode?: string;
  cadastralLastEventAt?: string;
  cadastralLastEventCode?: string;
  baunitIdOrigin?: string;
  hash?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string;
  updatedAt?: string;
  masterGroup?: string;
  detailGroup?: string;
  cadastralNumberFormat?: string;
  cadNumDetail?: string;
  npnlike?: string;
  baunitIdE?: string;
  propertyRegistryAreaE?: string;
  cadastralAreaE?: string;
  executionId?: string;


  constructor(content?: any) {
    this.propertyRegistryOffice = content?.propertyRegistryOffice || '';
    this.propertyRegistryNumber = content?.propertyRegistryNumber || '';
    this.propertyRegistryArea = content?.propertyRegistryArea || '';
    this.cadastralArea = content?.cadastralArea || '';
    this.cadastralNumber = content?.cadastralNumber || '';
    this.cadastralLastNumber = content?.cadastralLastNumber || '';
    this.cadastralRegistryNumberTemp = content?.cadastralRegistryNumberTemp || '';
    this.cadlAreaCommonE = content?.cadlAreaCommonE || '';
    this.cadAreaPrivateE = content?.cadAreaPrivateE || '';
    this.cadastralAreaUnitbuilt = content?.cadastralAreaUnitbuilt || '';
    this.cadAreaUnitbuiltCommon = content?.cadAreaUnitbuiltCommon || '';
    this.cadAreaUnitbuiltPrivate = content?.cadAreaUnitbuiltPrivate || '';

    this.cadastralRegistryNumber = content?.cadastralRegistryNumber || '';
    this.cadastralCreatedAt = content?.cadastralCreatedAt || '';
    this.domBaunitType = content?.domBaunitType || '';
    this.domBaunitCondition = content?.domBaunitCondition || '';
    this.domBaunitEconoDesti = content?.domBaunitEconoDesti || '';
    this.domBaunitProcessType = content?.domBaunitProcessType || '';
    this.cadastralLastMasiveEventAt = content?.cadastralLastMasiveEventAt || '';
    this.cadastralLastMasiveEventCode = content?.cadastralLastMasiveEventCode || '';
    this.cadastralLastEventAt = content?.cadastralLastEventAt || '';
    this.cadastralLastEventCode = content?.cadastralLastEventCode || '';
    this.baunitIdOrigin = content?.baunitIdOrigin || '';
    this.hash = content?.hash || '';
    this.createdBy = content?.createdBy || '';
    this.createdAt = content?.createdAt || '';
    this.updatedBy = content?.updatedBy || '';
    this.updatedBy = content?.updatedBy || '';
    this.updatedAt = content?.updatedAt || '';
    this.masterGroup = content?.masterGroup || '';
    this.detailGroup = content?.detailGroup || '';
    this.cadastralNumberFormat = content?.cadastralNumberFormat || '';
    this.cadNumDetail = content?.cadNumDetail || '';
    this.npnlike = content?.npnlike || '';
    this.baunitIdE = content?.baunitIdE || '';
    this.propertyRegistryAreaE = content?.propertyRegistryAreaE || '';
    this.cadastralAreaE = content?.cadastralAreaE || '';
    this.executionId = content?.executionId || '';
  }
}

export interface UpdateBasicInformationProperty {
  propertyRegistryOffice:      string;
  propertyRegistryNumber:      string;
  propertyRegistryArea:        number;
  cadastralArea:               number;
  cadastralNumber:             string;
  cadastralLastNumber:         string;
  cadastralRegistryNumberTemp: string;
  cadastralRegistryNumber:     null;
  domBaunitType:               string;
  domBaunitCondition:          string;
  domBaunitEconoDesti:         string;
  domBaunitProcessType:        null;
}

