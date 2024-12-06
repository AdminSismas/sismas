export interface User {
  content:          Content[];
  pageable:         Pageable;
  totalElements:    number;
  totalPages:       number;
  last:             boolean;
  size:             number;
  number:           number;
  sort:             Sort;
  numberOfElements: number;
  first:            boolean;
  empty:            boolean;
}

export interface Content {
  userId:                number;
  username:              string;
  email:                 string;
  emailValidAt:          null;
  validBeginAt:          Date;
  validToAt:             Date;
  individual:            Individual;
  role:                  Role;
  enabled:               boolean;
  accountNonExpired:     boolean;
  authorities:           Authority[];
  accountNonLocked:      boolean;
  credentialsNonExpired: boolean;
}

export interface Authority {
  authority: Role;
}

export enum Role {
  Admin = "ADMIN",
  User = "USER",
}

export interface Individual {
  individualId:             number;
  number:                   string;
  domIndividualTypeNumber:  DOMIndividualTypeNumber;
  domIndividualType:        DOMIndividualType;
  firstName:                string;
  middleName:               null | string;
  lastName:                 string;
  otherLastName:            string;
  companyName:              null | string;
  domIndividualSex:         null | string;
  domIndividualEthnicGroup: null | string;
  hash:                     string;
  createdBy:                AtedBy;
  createdAt:                Date;
  updatedBy:                AtedBy;
  updatedAt:                Date;
  fullName:                 string;
}

export enum AtedBy {
  MigPrediosPlus = "Mig_PrediosPlus",
  Test7 = "test7",
  TestUsuarioSession = "TestUsuarioSession",
}

export enum DOMIndividualType {
  PersonaNatural = "Persona natural",
}

export enum DOMIndividualTypeNumber {
  CédulaDeCiudadanía = "Cédula de ciudadanía",
}

export interface Pageable {
  pageNumber: number;
  pageSize:   number;
  sort:       Sort;
  offset:     number;
  paged:      boolean;
  unpaged:    boolean;
}

export interface Sort {
  empty:    boolean;
  sorted:   boolean;
  unsorted: boolean;
}


