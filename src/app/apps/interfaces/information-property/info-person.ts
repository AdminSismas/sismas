import { TypeOperationPeople } from '../general/content-info';
import { InfoContact } from './info-contact';

export class InfoPerson {
  companyName: string | null;
  contact: InfoContact| null;
  createdAt: string;
  createdBy: string;
  domIndividualEthnicGroup: string | null;
  domIndividualSex: string | null;
  domIndividualType: string;
  domIndividualTypeNumber: string;
  firstName: string;
  fullName: string;
  id: number;
  hash: string;
  individualId: number;
  lastName: string;
  middleName: string | null;
  number: string;
  otherLastName: string;
  updatedAt: string;
  updatedBy: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(content?: any) {
    this.individualId = content ?.individualId ?? 0;
    this.number = content?.number ?? '';
    this.domIndividualTypeNumber = content?.domIndividualTypeNumber ?? '';
    this.domIndividualType = content?.domIndividualType ?? '';
    this.firstName = content?.firstName ?? '';
    this.middleName = content?.middleName ?? null;
    this.lastName = content?.lastName ?? '';
    this.otherLastName = content?.otherLastName ?? '';
    this.companyName = content?.companyName ?? null;
    this.domIndividualSex = content?.domIndividualSex ?? null;
    this.domIndividualEthnicGroup = content?.domIndividualEthnicGroup ?? null;
    this.domIndividualEthnicGroup = content?.domIndividualEthnicGroup ?? null;
    this.contact = content?.contact ?? null;
    this.hash = content?.hash ?? '';
    this.createdBy = content?.createdBy ?? '';
    this.createdAt = content?.createdAt ?? '';
    this.updatedBy = content?.updatedBy ?? '';
    this.updatedAt = content?.updatedAt ?? '';
    this.fullName = content?.fullName ?? '';
    this.id = content?.id ?? 0;
  }
}

export interface ExtraInfoPerson extends InfoPerson {
  mode: TypeOperationPeople | null;
}

