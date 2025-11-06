import * as domain from 'domain';

export class TypesQualificationUB {
  id?: number;
  domain? :string;
  dispname? :string;
  colombiaCode? :string;
  description? :string;


  constructor(context?: any) {
    this.id = context.id;
    this.domain = context.domain;
    this.dispname = context.dispname;
    this.colombiaCode = context.colombiaCode;
    this.description = context.description;
  }
}
