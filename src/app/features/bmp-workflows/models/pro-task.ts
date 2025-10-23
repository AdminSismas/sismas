export class ProTask {
  taskId?: number;
  flowName?: string;
  processName?: string;
  flowDetail?: string;
  assignee?: string;
  assigneeAt?: string;
  beginAt?: string;
  finishAt?: string;
  dueDate?: string;
  bpmPriority?: number;
  devolution?: boolean;
  daysFinish?: number;
  daysBegin?: number;
  daysBeginS?: string;

  constructor(content?: any) {
    this.taskId = content.taskId || 0;
    this.flowName = content.flowName || '';
    this.processName = content.processName || '';
    this.flowDetail = content.flowDetail || '';
    this.assignee = content.assignee || '';
    this.assigneeAt = content.assigneeAt || '';
    this.beginAt = content.beginAt || '';
    this.finishAt = content.finishAt || '';
    this.dueDate = content.dueDate || '';
    this.bpmPriority = content.bpmPriority || '';
    this.devolution = content.devolution || '';
    this.daysFinish = content.daysFinish || '';
    this.daysBegin = content.daysBegin || '';
    this.daysBeginS = content.daysBeginS || '';
  }
}
