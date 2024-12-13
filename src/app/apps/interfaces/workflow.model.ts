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

export interface CreateWorkflowParams {
  name: string;
  description: string;
  bpmProcessCategory: string;
  key: string;
  version: string;
  resource: string;
  image: string;
  validBeginAt: string | null;
  validToAt: string | null;
  rev: string;
}

