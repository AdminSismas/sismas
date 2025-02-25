export class contentInfoWorkflow {
    key: string;
    name: string;
    description: string;
    bpmProcessCategory: string;
    version: string;
    validToAt: string;
    dueDays: string;

    constructor(content?: any) {
        this.key = content.key;
        this.name = content.name;
        this.description = content.description;
        this.bpmProcessCategory = content.bpmProcessCategory;
        this.version = content.version;
        this.validToAt = content.validToAt;
        this.dueDays = content.dueDays;
    }
}
