
export type TypeInformation = 'visualization' | 'edition';
export type TypeOperation = 'CREATE' | 'UPDATE' | 'DELETE';
export type InputType = 'text' | 'number' | 'email' | 'password';
export type TypeOperationAlfaMain = 'ADD' | 'CREATE' | 'DELETE';

export interface ObjectSchema {
  schema: string;
  title: string;
}

export interface ClearInformationData {
  message: string;
  keyWord: string;
}


