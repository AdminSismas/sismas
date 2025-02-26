import { TypeOperation } from '../general/content-info';

export class DifferenceChanges  {
  entity?:string;
  field?:string;
  oldValue?:string;
  newValue?:string;
  operationType?: TypeOperation;
  order?:string;
  baunitIdE?:string;
  executionId?:string;


  constructor(content?: any, executionId?:string, baunitIdE?:string) {
    this.entity = content?.entity || '';
    this.field = content?.field || '';
    this.oldValue = content?.oldValue || '';
    this.newValue = content?.newValue || '';
    this.operationType = content?.operationType;
    this.order = content?.order || '';
    this.executionId = executionId || '';
    this.baunitIdE = baunitIdE || '';
  }

}
