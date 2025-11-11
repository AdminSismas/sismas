export class ProceduresProcessCollection {
    processId?: number;
    name?: string;
    description?: string;
    bpmProcessCategory?: string;
    Key?: string;
    version?: string;
    resource?: string;
    image?: string;

    constructor(processId: number, name: string, description: string, bpmProcessCategory: string, Key: string, version: string, resource: string, image: string) {
        this.processId = processId;
        this.name = name;
        this.description = description;
        this.bpmProcessCategory = bpmProcessCategory;
        this.Key = Key;
        this.version = version;
        this.resource = resource;
        this.image = image;
    }
}