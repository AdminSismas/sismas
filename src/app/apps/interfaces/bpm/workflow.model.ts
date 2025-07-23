export class WorkflowCollection {
  processId?: number;
  name?: string;
  description?: string;
  bpmProcessCategory?: string;
  key?: string;
  version?: string;
  resource?: any;
  image?: string;
  validBeginAt?: string;
  validToAt?: string;
  dueDays?: string;
  icon?: string;

  constructor(processId: number, name: string, description: string, bpmProcessCategory: string, key: string, version: string, resource: any, image: string, validBeginAt: string, validToAt: string, dueDays: string, icon: string) {
    this.processId = processId;
    this.name = name;
    this.description = description;
    this.bpmProcessCategory = bpmProcessCategory;
    this.key = key;
    this.version = version;
    this.resource = resource;
    this.image = image;
    this.validBeginAt = validBeginAt;
    this.validToAt = validToAt;
    this.dueDays = dueDays;
    this.icon = icon;
  }
}

export interface Proflow {
  flowId:         number;
  preform:        Preform;
  key:            string;
  orderFlow:      number;
  name:           string;
  dueDays:        number;
  bpmLaneNames:   string;
  question:       null | string;
  questionFlow:   null | string;
  transientField: boolean;
}

export interface Preform {
  preformId: number;
  name?:      string;
  pathForm?:  string;
  params?:    null;
}

export interface TaskListData {
  tasks: Proflow[];
  processId: string;
  name: string;
  key: string;
}




