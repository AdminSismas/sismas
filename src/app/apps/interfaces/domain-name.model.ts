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
