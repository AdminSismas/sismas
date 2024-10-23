export class contentInfoDomainLadmCol {
    domainId: number;
    domainName: string;
    domainCode: string;
    dispName: string;
    description: string;


    constructor(content?: any) {
        this.domainId = content.domainId;
        this.domainName = content.domainName;
        this.domainCode = content.code;
        this.dispName = content.dispname;
        this.description = content.description;
    }
}
