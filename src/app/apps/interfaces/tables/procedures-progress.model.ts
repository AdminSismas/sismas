import { ProceduresProcessCollection } from '@shared/interfaces';

export class ProceduresCollection {
    executionId?: number;
    executionCode?: string;
    process?: ProceduresProcessCollection;
    processName?: string;
    bpmProcessCategory?: string;
    bpmPriority?: number;
    beginAt?: string;
    finishAt?: string;
    lastUpdateBy?: string;
    lastUpdateAt?: string;
    suspensionStartAt?: string;
    suspendedDays?: number;
    dueDate?: string;

    constructor(executionId: number, executionCode: string, process: ProceduresProcessCollection, processName: string, bpmProcessCategory: string, bpmPriority: number, begindAt: string, finishAt: string, lastUpdateBy: string, lastUpdateAt: string, suspensionStartAt: string, suspendedDays: number, dueDate: string) {
        this.executionId = executionId;
        this.executionCode = executionCode;
        this.process = process;
        this.processName = processName;
        this.bpmProcessCategory = bpmProcessCategory;
        this.bpmPriority = bpmPriority;
        this.beginAt = begindAt;
        this.finishAt = finishAt;
        this.lastUpdateBy = lastUpdateBy;
        this.lastUpdateAt = lastUpdateAt;
        this.suspensionStartAt = suspensionStartAt;
        this.suspendedDays = suspendedDays;
        this.dueDate = dueDate;
    }
}
