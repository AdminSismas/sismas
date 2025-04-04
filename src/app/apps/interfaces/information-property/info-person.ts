import { TypeOperationPeople } from '../general/content-info';
import { InfoContact } from './info-contact';

export class InfoPerson {
  individualId: number;
  number: string;
  domIndividualTypeNumber: string;
  domIndividualType: string;
  firstName: string;
  middleName: string | null;
  lastName: string;
  otherLastName: string;
  companyName: string | null;
  domIndividualSex: string | null;
  domIndividualEthnicGroup: string | null;
  contact: InfoContact| null;
  hash: string;
  createdBy: string;
  createdAt: string;
  updatedBy: string;
  updatedAt: string;
  fullName: string;

  constructor(content?: any) {
    this.individualId = content ?.individualId || 0;
    this.number = content?.number || '';
    this.domIndividualTypeNumber = content?.domIndividualTypeNumber || '';
    this.domIndividualType = content?.domIndividualType || '';
    this.firstName = content?.firstName || '';
    this.middleName = content?.middleName || null;
    this.lastName = content?.lastName || '';
    this.otherLastName = content?.otherLastName || '';
    this.companyName = content?.companyName || null;
    this.domIndividualSex = content?.domIndividualSex || null;
    this.domIndividualEthnicGroup = content?.domIndividualEthnicGroup || null;
    this.domIndividualEthnicGroup = content?.domIndividualEthnicGroup || null;
    this.contact = content?.contact || null;
    this.hash = content?.hash || '';
    this.createdBy = content?.createdBy || '';
    this.createdAt = content?.createdAt || '';
    this.updatedBy = content?.updatedBy || '';
    this.updatedAt = content?.updatedAt || '';
    this.fullName = content?.fullName || '';
  }
}

export interface ExtraInfoPerson extends InfoPerson {
  mode: TypeOperationPeople | null;
}

