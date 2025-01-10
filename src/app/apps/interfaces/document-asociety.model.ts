export class DocumentAsocietyModel {
    outTempplateId?: number;
    templateCode?: string;
    htmlTemplate?: string;
    headerTemplateId?: number;
    footerTemplate?: string;
    isSinged?: boolean;
    updateAt?: number;
    updateBy?: string;
    createdBy?: string;
    createdAt?: string;
    updatedBy?: string;
    updatedAt?: string;
    schema?:string;
    baunitId?:string;
    page?: number;
    size?: number;
  
  
    constructor(content?: any,schema?:string, baunitId?: string,page?: number, size?: number,) {
        this.outTempplateId = content.outTempplateId;
        this.templateCode = content.templateCode;
        this.htmlTemplate = content.htmlTemplate;
        this.headerTemplateId = content.headerTemplate;
        this.footerTemplate = content.footerTemplate;
        this.isSinged = content.isSinged;
        this.updateAt = content.updateAt;
        this.updateBy = content.updateBy;
        this.createdBy = content.createdBy;
        this.createdAt = content.createdAt;
        this.updatedBy = content.updatedBy;
        this.updatedAt = content.outTempplateId;
        this.schema = content.schema;
        this.baunitId = content.baunitId;
        this.page = page;
        this.size = size;
    }
}