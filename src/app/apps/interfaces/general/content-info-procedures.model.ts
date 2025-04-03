export class contentInfoProcedures {
    executionCode: string;
    bpmProcessCategory: string;
    processName: string;
    lastUpdateBy: string;
    lastUpdateAt: string;
    suspendedDays: number;
    dueDate: string;
    executionId?: number;
    bpmPriority?: number;


    constructor(content?: any) {
        this.executionCode = content.executionCode;
        this.bpmProcessCategory = content.bpmProcessCategory;
        this.processName = content.process?.name || '';
        this.lastUpdateBy = content.lastUpdateBy;
        this.lastUpdateAt = content.lastUpdateAt;
        this.suspendedDays = content.suspendedDays;
        this.dueDate = content.dueDate;
        this.executionId = content.executionId;
        this.bpmPriority = content.bpmPriority;
    }
}
