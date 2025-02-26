export class OutFormatModel {
    outTemplateId?: number | undefined; ;
    templateCode?: string | '';
    htmlTemplate?: string | '';
    headerTemplate?: HeaderTemplateModel  | null;
    footerTemplate?: FooterTemplateModel  | null;
    isSinged?: boolean | '';
    createdAt?: string | '';
    createdBy?: string | '';
    updatedBy?: string | '';
    updatedAt?: string | '';
    schema?:string | '';
    page?: number | '';
    size?: number | '';
  
  
    constructor(content?: any,schema?:string,page?: number, size?: number,) {
        this.outTemplateId = content.outTemplateId;
        this.templateCode = content.templateCode;
        this.htmlTemplate = content.htmlTemplate;
        if (this.headerTemplate) {
            this.headerTemplate.outTemplateId = content.headerTemplate.outTemplateId;
        } else {
            this.headerTemplate = content.headerTemplate;
        }
        if (this.footerTemplate) {
            this.footerTemplate.outTemplateId = content.footerTemplate.outTemplateId;
        } else {
            this.footerTemplate = content.footerTemplate;
        }
        this.isSinged = content.isSinged;
        this.updatedBy = content.updateBy;
        this.createdBy = content.createdBy;
        this.createdAt = content.createdAt;
        this.updatedAt = content.updatedAt;

        this.schema = content.schema;
        this.page = page;
        this.size = size;
    }
}


export class HeaderTemplateModel {
    outTemplateId?: number;
  
    constructor(outTemplateId?: number) {
        this.outTemplateId = outTemplateId;
    }

}

export class FooterTemplateModel {
    outTemplateId?: number;
  
    constructor(outTemplateId?: number) {
        this.outTemplateId = outTemplateId;
    }

}
