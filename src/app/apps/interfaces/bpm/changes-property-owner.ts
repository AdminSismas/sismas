export interface ParamsRrright {
  schema: string,
  executionId: string,
  baunitId: string,
  params: NewOwner | UpdatePropertyOwner
}

interface NewOwner {
  domRightType: string;
  fraction: number;
  beginAt: string;
  individual: { individualId: number };
}

export interface AddPropertyOwnerData {
  ownersData: Owners[];
  baunitId: string;
  schema: string;
  executionId: string;
}

export interface Owners {
  beginAt:                 Date;
  fractionS:               string;
  domRightType:            string;
  domIndividualTypeNumber: string;
  number:                  string;
  fullName:                string;
}

export interface InfoPerson {
  individualId:             number;
  number:                   string;
  domIndividualTypeNumber:  string;
  domIndividualType:        string;
  firstName:                string;
  middleName:               string;
  lastName:                 string;
  otherLastName:            string;
  companyName:              null;
  domIndividualSex:         string;
  domIndividualEthnicGroup: string;
  hash:                     string;
  createdBy:                string;
  createdAt:                Date;
  updatedBy:                string;
  updatedAt:                Date;
  fullName:                 string;
}

export interface DeleteParamsRrright {
  executionId: string,
  baunitId: string,
  rightId: number,
}

export interface DialogsData {
  rightId: number;
  executionId: string;
  baunitId: string;
  schema?: string;
  fullName: string;
  rrrightInfo?: RrrightInfo;
  individual: InfoPerson;
}

export interface UpdatePropertyOwner {
  rightId: number;
  domRightType: string;
  fraction: number;
  beginAt: string;
  individual: { individualId: number };
}

export interface RrrightInfo {
  fraction: number;
  beginAt: string;
  domRightType: string;
}

