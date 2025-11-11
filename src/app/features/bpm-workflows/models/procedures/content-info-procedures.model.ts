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
    status: Status;


    constructor(content?: Partial<contentInfoProcedures>) {
        this.executionCode = content?.executionCode ?? '';
        this.bpmProcessCategory = content?.bpmProcessCategory ?? '';
        this.processName = content?.processName ?? '';
        this.lastUpdateBy = content?.lastUpdateBy ?? '';
        this.lastUpdateAt = content?.lastUpdateAt ?? '';
        this.suspendedDays = content?.suspendedDays ?? 0;
        this.dueDate = content?.dueDate ?? '';
        this.executionId = content?.executionId ?? 0;
        this.bpmPriority = content?.bpmPriority ?? 0;
        this.status = content?.status ?? 'CANCELLED';
    }
}

export type Status = 'COMPLETED' | 'CANCELLED' | 'ACTIVE';