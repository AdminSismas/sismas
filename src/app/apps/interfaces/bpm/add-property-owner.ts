export interface postParamsRrright {
  domain: string,
  executionId: string,
  baunitId: string,
  params: NewOwner
}

interface NewOwner {
  domRightType: string;
  fraction: number;
  beginAt: string;
  individual: { individualId: number };
}

export interface AddPropertyOwnerData {
  ownersData:     Owners[];
  baunitId: string;
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


