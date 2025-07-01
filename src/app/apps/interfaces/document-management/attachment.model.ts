export class AttachmentCollection {
    id?: number;
    originalFileName?: string;
    size?: string;
    attachmentType?: string;
    blocked?: string;
    description?: string;
    createdBy?: string;
    createdAt?: string;
    aprovedBy?: string;
    aprovedAt?: string;
    flowName?: string;
    publicPath?: string;


    constructor(id: number, originalFileName: string, size: string, attachmentType: string, blocked: string, description: string, createdBy: string, createdAt: string, aprovedBy: string, aprovedAt: string, flowName: string, publicPath: string) {
        this.id = id;
        this.originalFileName = originalFileName;
        this.size = size;
        this.attachmentType = attachmentType;
        this.blocked = blocked;
        this.description = description;
        this.createdBy = createdBy;
        this.createdAt = createdAt;
        this.aprovedBy = aprovedBy;
        this.aprovedAt = aprovedAt;
        this.flowName = flowName;
        this.publicPath = publicPath;
    }
}