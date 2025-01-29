export class UserDetails {
    userId: number;
    username: string;
    email: string;
    emailValidAt: string | null;
    validBeginAt: string;
    validToAt: string;
    individual: Individual;
    role: string;
    enabled: boolean | string;
    accountNonExpired: boolean;
    authorities: Authority[];
    accountNonLocked: boolean;
    credentialsNonExpired: boolean;

    constructor(data: any) {
      this.userId = data.userId;
      this.username = data.username;
      this.email = data.email;
      this.emailValidAt = data.emailValidAt;
      this.validBeginAt = data.validBeginAt;
      this.validToAt = data.validToAt;
      this.individual = new Individual(data.individual);
      this.role = data.role;
      this.enabled = data.enabled;
      this.accountNonExpired = data.accountNonExpired;
      this.authorities = data.authorities.map((auth: any) => new Authority(auth));
      this.accountNonLocked = data.accountNonLocked;
      this.credentialsNonExpired = data.credentialsNonExpired;
    }
  }

  export class Individual {
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
    hash: string;
    createdBy: string;
    createdAt: string;
    updatedBy: string;
    updatedAt: string;
    fullName: string;

    constructor(data: any) {
      this.individualId = data.individualId;
      this.number = data.number;
      this.domIndividualTypeNumber = data.domIndividualTypeNumber;
      this.domIndividualType = data.domIndividualType;
      this.firstName = data.firstName;
      this.middleName = data.middleName;
      this.lastName = data.lastName;
      this.otherLastName = data.otherLastName;
      this.companyName = data.companyName;
      this.domIndividualSex = data.domIndividualSex;
      this.domIndividualEthnicGroup = data.domIndividualEthnicGroup;
      this.hash = data.hash;
      this.createdBy = data.createdBy;
      this.createdAt = data.createdAt;
      this.updatedBy = data.updatedBy;
      this.updatedAt = data.updatedAt;
      this.fullName = data.fullName;
    }
  }

  export class Authority {
    authority: string;

    constructor(data: any) {
      this.authority = data.authority;
    }
  }

  export interface DecodeJwt {
    
    sub: string;
    role: string;
    exp: number;
    iat: number;
  }
