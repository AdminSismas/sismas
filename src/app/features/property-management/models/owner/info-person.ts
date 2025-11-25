import { TypeOperationPeople } from '@shared/interfaces';
import { InfoContact } from '@features/property-management/models/owner/info-contact';

export class InfoPerson {
  companyName: string | null;
  contact: InfoContact| null;
  createdAt: string;
  createdBy: string;
  divpolLv1: string | null;
  divpolLv2: string | null;
  domIndividualEthnicGroup: string | null;
  domIndividualSex: string | null;
  domIndividualType: string;
  domIndividualTypeNumber: string;
  firstName: string;
  fullName: string;
  hash: string;
  id: number;
  individualId: number;
  lastName: string;
  middleName: string | null;
  number: string;
  otherLastName: string;
  updatedAt: string;
  updatedBy: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(content?: any) {
    this.companyName = content?.companyName ?? null;
    this.contact = content?.contact ?? null;
    this.createdAt = content?.createdAt ?? '';
    this.createdBy = content?.createdBy ?? '';
    this.divpolLv1 = content?.divpolLv1 ?? null;
    this.divpolLv2 = content?.divpolLv2 ?? null;
    this.domIndividualEthnicGroup = content?.domIndividualEthnicGroup ?? null;
    this.domIndividualEthnicGroup = content?.domIndividualEthnicGroup ?? null;
    this.domIndividualSex = content?.domIndividualSex ?? null;
    this.domIndividualType = content?.domIndividualType ?? '';
    this.domIndividualTypeNumber = content?.domIndividualTypeNumber ?? '';
    this.firstName = content?.firstName ?? '';
    this.fullName = content?.fullName ?? '';
    this.hash = content?.hash ?? '';
    this.id = content?.id ?? 0;
    this.individualId = content ?.individualId ?? 0;
    this.lastName = content?.lastName ?? '';
    this.middleName = content?.middleName ?? null;
    this.number = content?.number ?? '';
    this.otherLastName = content?.otherLastName ?? '';
    this.updatedAt = content?.updatedAt ?? '';
    this.updatedBy = content?.updatedBy ?? '';
  }
}

export interface ExtraInfoPerson extends InfoPerson {
  mode: TypeOperationPeople | null;
}

