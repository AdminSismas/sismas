export class DomainCollection {
  domainId?: number;
  domainName?: string;
  code?: string;
  inactive?: boolean;
  dispname?: string;
  description?: string;


  constructor(content?: any) {
    this.domainId = content?.domainId || '';
    this.domainName = content?.domainName || '';
    this.code = content?.code || '';
    this.inactive = content?.inactive || '';
    this.dispname = content?.dispname || '';
    this.description = content?.description || '';
  }

  set domainCode(value: string) {
  }

  get domainCode(): string {
    let domainCode = '';
    try {
      if (this.code !== null && this.code !== undefined && this.code !== '' && this.code.includes('.')) {
        domainCode = this.code.split('.')[1];
      }
    } catch (error) {
      domainCode = '';
    }
    return domainCode;
  }
}


export class DomainCalificationCollection {
  Id?: number;
  domain?: string;
  dispname?: string;
  colombiaCode?: number;
  description?: string;


  constructor(Id: number, domain: string, dispname: string, colombiaCode: number, description: string) {
    this.Id = Id;
    this.domain = domain;
    this.dispname = dispname;
    this.colombiaCode = colombiaCode;
    this.description = description;


  }
}
