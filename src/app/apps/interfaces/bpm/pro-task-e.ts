import { ProTask } from './pro-task';

export class ProTaskE {
  executionId?: number;
  flowId?: number;
  isBegin?: boolean;
  isEnd?: boolean;
  asigned?: number;
  devolution?: number;
  priority?: number;
  icon?: string;
  proTask?: ProTask;


  constructor(content?: any) {
    this.executionId = content.executionId || 0;
    this.flowId = content.flowId || 0;
    this.isBegin = content.isBegin || false;
    this.isEnd = content.isEnd || false;
    this.asigned = content.asigned || 0;
    this.devolution = content.devolution || 0;
    this.priority = content.priority || 0;
    this.icon = content.icon || '';
    this.proTask = content.proTask || null;
  }
}
