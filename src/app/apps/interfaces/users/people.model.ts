import { TypeOperationPeople } from "../general/content-info";

export class People {
  id: number;
  individualId: number;
  imageSrc: string;
  firstName: string;
  fullName: string;
  middleName: string;
  lastName: string;
  labels: any;
  domIndividualType: any;
  number: any;
  otherLastName: string;
  companyName: string;
  domIndividualSex: string;
  domIndividualTypeNumber: string;
  domIndividualEthnicGroup: string;

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
  }
}



export interface ExtraInfoPeople extends People {
  mode: TypeOperationPeople;
  onlyModifyContact: boolean | null;
}
