import { BaunitHead } from '../information-property/baunit-head.model';
import { TypeOperation } from '../content-info';

export class Operation {
  operationType?:TypeOperation;
  npnlike?:string;
  appliedAlfa?:boolean;
  baunitHead?: BaunitHead;
  appliedGeo?:boolean;


  constructor(content?: any) {
    this.operationType = content?.operationType || '';
    this.npnlike = content?.npnlike || '';
    this.appliedAlfa = content?.appliedAlfa || '';
    this.baunitHead = content?.baunitHead || '';
    this.appliedGeo = content?.appliedGeo || '';
  }

  set registration(value:string) {}

  get registration(): string {
    const name = '';
    if (this.baunitHead?.propertyRegistryOffice && this.baunitHead?.propertyRegistryNumber) {
      return `${this.baunitHead?.propertyRegistryOffice} - ${this.baunitHead?.propertyRegistryNumber}`;
    } else if (this.baunitHead?.propertyRegistryOffice) {
      return `${this.baunitHead?.propertyRegistryOffice}`;
    } else if (this.baunitHead?.propertyRegistryNumber) {
      return `${this.baunitHead?.propertyRegistryNumber}`;
    }
    return name;
  }

  set cadastralNumber(value:string) {}

  get cadastralNumber(): string {
    return this.baunitHead?.cadastralNumber || '';
  }

  set cadastralArea(value:number) {}

  get cadastralArea(): number {
    return this.baunitHead?.cadastralArea || 0;
  }

  set domBaunitCondition(value:string) {}

  get domBaunitCondition(): string {
    return this.baunitHead?.domBaunitCondition || '';
  }

  set domBaunitEconoDesti(value:string) {}

  get domBaunitEconoDesti(): string {
    return this.baunitHead?.domBaunitEconoDesti || '';
  }

}
