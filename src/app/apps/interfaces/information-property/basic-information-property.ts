import { BasicDetailGroup } from './basic-detail-group';
import { BasicMasterGroup } from './basic-master-group';
import { TypeOperation } from '../general/content-info';

export class BasicInformationProperty {

  // GRUPO "Identificación del predio"
  cadastralNumberFormat?: string;
  cadastralNumber?: string;
  cadastralLastNumber?: string;
  propertyRegistryOffice?: string;
  propertyRegistryNumber?: string;
  baunitIdOrigin?: string;


 // *****GRUPO "Propiedad y uso" ****
 domBaunitEconoDesti?: string;
 domBaunitType?: string;
 domBaunitCondition?: string;
 cadastralRegistryNumber?: string;
 cadastralRegistryNumberTemp?: string;

   // *****GRUPO "Tamaños y áreas" ****
  propertyRegistryAreaE?: string;
  cadastralAreaE?: string;
  cadastralArea?: string | number;
  cadAreaCommonE?: string;
  cadAreaCommon?: string | number;
  cadAreaPrivateE?: string;
  cadAreaPrivate?: string | number;
  cadastralAreaUnitbuilt?: string | number;
  cadAreaUnitbuiltCommonE?: string;
  cadAreaUnitbuiltCommon?: string | number;
  cadAreaUnitbuiltPrivateE?: string;
  cadAreaUnitbuiltPrivate?: string |  number;

  // *****GRUPO "Seguimientos y actualizaciones" ****
  cadastralLastEventAt?: string;
  cadastralLastEventCode?: string;
  updatedBy?: string;
  updatedAt?: string;


  propertyRegistryArea?: string;
  cadastralAreaGeoE?: string;
  cadastralCreatedAt?: string;
  domBaunitProcessType?: string;
  cadastralLastMasiveEventAt?: string;
  cadastralLastMasiveEventCode?: string;
  hash?: string;
  createdBy?: string;
  createdAt?: string;
  masterGroup?: BasicMasterGroup;
  detailGroup?: BasicDetailGroup;
  cadNumDetail?: string;
  npnlike?: string;
  baunitIdE?: string;
  executionId?: string;


  constructor(content?: any) {
    this.propertyRegistryOffice = content?.propertyRegistryOffice || '';
    this.propertyRegistryNumber = content?.propertyRegistryNumber || '';
    this.propertyRegistryArea = content?.propertyRegistryArea || '';
    this.cadastralArea = content?.cadastralArea || '';
    this.cadastralAreaGeoE = content?.cadastralAreaGeoE || '';
    this.cadastralNumber = content?.cadastralNumber || '';
    this.cadastralLastNumber = content?.cadastralLastNumber || '';
    this.cadastralRegistryNumberTemp = content?.cadastralRegistryNumberTemp || '';
    this.cadAreaCommonE = content?.cadAreaCommonE || '';
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
    this.masterGroup = content?.masterGroup || null;
    this.detailGroup = content?.detailGroup || null;
    this.cadastralNumberFormat = content?.cadastralNumberFormat || '';
    this.cadNumDetail = content?.cadNumDetail || '';
    this.npnlike = content?.npnlike || '';
    this.baunitIdE = content?.baunitIdE || '';
    this.propertyRegistryAreaE = content?.propertyRegistryAreaE || '';
    this.cadastralAreaE = content?.cadastralAreaE || '';
    this.executionId = content?.executionId || '';
  }
}

export interface CrudBasicInformationProperty {
  type:TypeOperation;
  contentInformation: BasicInformationProperty | null;
  npnEdit?: boolean;
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

