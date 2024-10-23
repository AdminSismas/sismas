export class contentInfoAttachment {
    id: number;
    originalFileName: string;
    size: string;
    createdBy: string;
    createdAt: string;
    aprovedBy: string;
    aprovedAt: string;




    constructor(content?: any) {
        this.id = content.id;
        this.originalFileName = content.originalFileName;
        this.size = content.size;
        this.createdBy = content.createdBy;
        this.createdAt = content.createdAt;
        this.aprovedBy = content.aprovedBy;
        this.aprovedAt = content.aprovedAt;

    }


    get metaData() {
        return `
            ${this.id},
            ${this.originalFileName},
            ${this.size},
            ${this.createdBy},
            ${this.createdAt},
            ${this.aprovedBy},
            ${this.aprovedAt},
        `;
    }

    set metaData(content: string) {}
}