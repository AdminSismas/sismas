
export type TypeInformation = 'visualization' | 'edition';
export type TypeOperation = 'CREATE' | 'UPDATE' | 'DELETE' | 'READ_ONLY';
export type InputType = 'text' | 'number' | 'email' | 'password';
export type TypeOperationAlfaMain = 'ADD' | 'CREATE' | 'DELETE';
export type TypeOperationGeoMain = 'CREATE' | 'DELETE' | 'CAL_BOUND';
export type TypeButtonAlfaMain = 'AGR' | 'CRE' | 'BRR' | 'CRE_GEO' | 'DEL_GEO' | 'CAL_BOU';
export type TypeQualificationMode = 'TRADITIONAL' | 'TYPOLOGY' ;

export interface ObjectSchema {
  schema: string;
  title: string;
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


