import { ContentInfoSchema } from '@shared/interfaces';

export type Element =
  | 'input'
  | 'select'
  | 'toggle'
  | 'date'
  | 'file'
  | 'textarea'
  | 'autocomplete'
  | 'collection'
  | 'checkbox';

export type TypeInformation = 'visualization' | 'edition';
export type TypeOperation = 'CREATE' | 'UPDATE' | 'DELETE' | 'READ_ONLY' | 'UPDATE_UND';
export type InputType = 'text' | 'number' | 'email' | 'password';
export type TypeOperationAlfaMain = 'ADD' | 'CREATE' | 'DELETE';
export type TypeOperationGeoMain = 'CREATE' | 'DELETE' | 'CAL_BOUND';
export type TypeButtonAlfaMain = 'AGR' | 'CRE' | 'BRR' | 'CRE_GEO' | 'DEL_GEO' | 'CAL_BOU' | 'TAB_GEO' | 'EXD' | 'EXL' | 'VIGEN' | 'RESET' | 'CHANGES';
export type TypeQualificationMode = 'TRADITIONAL' | 'TYPOLOGY' | 'ANNEX' ;
export type TypeOperationPeople = 'create' | 'update' | 'peopleUpdate' | 'peopleCreate';

export interface ObjectSchema {
  schema: string;
  title: string;
  defaultObject: ContentInfoSchema;
}

export interface ClearInformationData {
  message: string;
  keyWord: string;
}

export interface CheckTypeQualificationMode {
  label: string;
  type: TypeQualificationMode;
}

export interface ValidateQualificationByDomBuiltType {
  domBuiltType: string;
  list: string[];
  shouldDisable: boolean;
}

export interface HistoryListBasic {
  nameList: string;
  executionId: number;
  bpmProcessCategory: string;
  processName: string;
  lastupdated_at: string;
}

export interface ThirdPartyAffectedParticipant {
  executionId: string;
  thirdPartyAffected: boolean;
}

export interface EditBasicPropertyInputs {
  groupName?: string;
  fields?: InputsField[];
}

export interface InputsField {
  name: string;
  label: string;
  placeholder: string;
  collection: boolean;
  type: string;
  group: string[];
  groupName: string;
}

export interface NavigationItemCadastralInfo {
  label: string;
  fragment: string;
}



