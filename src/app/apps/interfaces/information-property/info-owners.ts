import { InfoPerson } from './info-person';

export class InfoOwners {
  rightId?:number;
  domRightType?:string;
  fraction?:number;
  beginAt?:string;
  endsIn?:string;
  individual?: InfoPerson;
  hash?:string;
  createdBy?:string;
  createdAt?:string;
  updatedBy?:string;
  updatedAt?:string;
  fractionS?:string;
  schema?:string;


  constructor(content?: any) {
    this.rightId = content.rightId;
    this.domRightType = content.domRightType;
    this.fraction = content.fraction;
    this.beginAt = content.beginAt;
    this.endsIn = content.endsIn;
    this.individual = content.individual;
    this.hash = content.hash;
    this.createdBy = content.createdBy;
    this.createdAt = content.createdAt;
    this.updatedBy = content.updatedBy;
    this.updatedAt = content.updatedAt;
    this.fractionS = content.fractionS;
  }
}
