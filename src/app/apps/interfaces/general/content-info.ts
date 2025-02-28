
export type TypeInformation = 'visualization' | 'edition';
export type TypeOperation = 'CREATE' | 'UPDATE' | 'DELETE';
export type InputType = 'text' | 'number' | 'email' | 'password';
export type TypeOperationAlfaMain = 'ADD' | 'CREATE' | 'DELETE';
export type TypeOperationGeoMain = 'CREATE' | 'DELETE' | 'CAL_BOUND';
export type TypeButtonAlfaMain = 'AGR' | 'CRE' | 'BRR' | 'CRE_GEO' | 'DEL_GEO' | 'CAL_BOU';

export interface ObjectSchema {
  schema: string;
  title: string;
}

export interface ClearInformationData {
  message: string;
  keyWord: string;
}


