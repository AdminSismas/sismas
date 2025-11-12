export interface BpmTypeProcess {
  processId?:number;
  name?:string;
  description?:string;
  bpmProcessCategory?:string;
  key?:string;
  version?:string;
  resource?:string;
  image?:string;
  validBeginAt?:string;
  validToAt?:string;
  dueDays?:number;
  icon?:string;
  selectProcess?: boolean;
}
