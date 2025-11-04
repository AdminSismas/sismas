export interface Individual {
  individualId?:number;
  number?:number;
  domIndividualTypeNumber?:string;
  domIndividualType?:string;
  firstName?:string;
  middleName?:string;
  lastName?:string;
  otherLastName?:string;
  companyName?:string;
  domIndividualSex?:string;
  domIndividualEthnicGroup?:string;
  hash?:string;
  createdBy: string,
  createdAt?:string;
  updatedBy?:string;
  updatedAt?:string;
  fullName?:string;
}
