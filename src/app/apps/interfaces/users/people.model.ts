/* eslint-disable @typescript-eslint/no-explicit-any */
import { TypeOperationPeople } from "../general/content-info";

export class People {
  companyName: string;
  createdAt: string;
  createdBy: string;
  domIndividualEthnicGroup: string;
  domIndividualSex: string;
  domIndividualType: string;
  domIndividualTypeNumber: string;
  firstName: string;
  fullName: string;
  id: number;
  imageSrc: string;
  individualId: number;
  hash: string;
  lastName: string;
  middleName: string;
  number: any;
  otherLastName: string;
  updatedAt: string;
  updatedBy: string;

  constructor(customer: any) {
    this.middleName = customer.middleName;
    this.id = customer.individualId;
    this.individualId = customer.individualId;
    this.imageSrc = customer.imageSrc;
    this.firstName = customer.firstName;
    this.fullName = customer.fullName;
    this.lastName = customer.lastName;
    this.domIndividualType = customer.domIndividualType;
    this.number = customer.number;
    this.companyName = customer.companyName;
    this.otherLastName = customer.otherLastName;
    this.domIndividualSex = customer.domIndividualSex;
    this.domIndividualTypeNumber = customer.domIndividualTypeNumber;
    this.domIndividualEthnicGroup = customer.domIndividualEthnicGroup;
    this.createdAt = customer.createdAt;
    this.createdBy = customer.createdBy;
    this.updatedAt = customer.updatedAt;
    this.updatedBy = customer.updatedBy;
    this.hash = customer.hash;
  }
}



export interface ExtraInfoPeople extends People {
  mode: TypeOperationPeople;
  onlyModifyContact: boolean | null;
}
