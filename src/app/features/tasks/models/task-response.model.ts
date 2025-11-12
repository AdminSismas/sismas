import { ProcessModel } from "./task-retail-execute-response.model";

export class TaskResponseModel{
    public executionId?: number;
    public executionCode?: string;
    public process?: ProcessModel;
    public processName?: string;
    public bpmProcessCategory?: string;
    public bpmPriority?: number;
    public beginAt?: string;
    public finishAt?: string;
    public lastUpdateBy?: string;
    public lastUpdateAt?: string;
    public suspensionStartAt?: string;
    public suspendedDays?: number;
    public dueDate?: string;

    constructor(){
    this.executionId = 0;
    this.executionCode = '';
    this.process = new ProcessModel;
    this.processName = '';
    this.bpmProcessCategory = '';
    this.bpmPriority = 0;
    this.beginAt = '';
    this.finishAt = '';
    this.lastUpdateBy = '';
    this.lastUpdateAt = '';
    this.suspensionStartAt = '';
    this.suspendedDays = 0;
    this.dueDate = '';
    }
}
