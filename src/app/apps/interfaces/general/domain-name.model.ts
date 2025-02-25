export class DomainCollection {
  domainId?: number;
  domainName?: string;
  code?: string;
  inactive?: boolean;
  dispname?: string;
  description?: string;


  constructor(domainId: number, domainName: string, code: string, inactive: boolean, dispname: string, description: string) {
    this.domainId = domainId;
    this.domainName = domainName;
    this.code = code;
    this.inactive = inactive;
    this.dispname = dispname;
    this.description = description;
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
