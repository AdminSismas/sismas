export class InfoPerson {
  individualId?: number;
  number?: string;
  domIndividualTypeNumber?: string;
  domIndividualType?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  otherLastName?: string;
  companyName?: string;
  domIndividualSex?: string;
  domIndividualEthnicGroup?: string;
  hash?: string;
  createdBy?: string;
  createdAt?: string;
  updatedBy?: string | null;
  updatedAt?: string;
  fullName?: string;

  constructor(content?: any) {
    this.individualId = content.individualId || 0;
    this.number = content.number || '';
    this.domIndividualTypeNumber = content.domIndividualTypeNumber || '';
    this.domIndividualType = content.domIndividualType || '';
    this.firstName = content.firstName || '';
    this.middleName = content.middleName || '';
    this.lastName = content.lastName || '';
    this.otherLastName = content.otherLastName || '';
    this.companyName = content.companyName || '';
    this.domIndividualSex = content.domIndividualSex || '';
    this.domIndividualEthnicGroup = content.domIndividualEthnicGroup || '';
    this.hash = content.hash || '';
    this.createdBy = content.createdBy || '';
    this.createdAt = content.createdAt || '';
    this.updatedBy = content.updatedBy || '';
    this.updatedAt = content.updatedAt || '';
    this.fullName = content.fullName || '';
  }

}
