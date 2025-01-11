export class DocumentAsocietyModel {
    outTempplateId?: number | '';
    templateCode?: string | '';
    htmlTemplate?: string | '';
    headerTemplateId?: HeaderTemplateModel | '' | null;
    footerTemplateId?: FooterTemplateModel | '' | null;
    isSinged?: boolean | '';
    createdAt?: string | '';
    createdBy?: string | '';
    updatedBy?: string | '';
    updatedAt?: string | '';
    schema?:string | '';
    page?: number | '';
    size?: number | '';
  
  
    constructor(content?: any,schema?:string, baunitId?: string,page?: number, size?: number,) {
        this.outTempplateId = content.outTempplateId;
        this.templateCode = content.templateCode;
        this.htmlTemplate = content.htmlTemplate;
        this.headerTemplateId= new HeaderTemplateModel(content.headerTemplateId);
        this.footerTemplateId = new FooterTemplateModel(content.footerTemplateId);
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
