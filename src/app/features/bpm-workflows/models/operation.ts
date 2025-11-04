import { BaunitHead } from '@shared/interfaces';
import { TypeOperation } from '@shared/interfaces';

export class Operation {
  operationType?:TypeOperation;
  npnlike?:string;
  appliedAlfa?:boolean;
  baunitHead?: BaunitHead;
  appliedGeo?:boolean;


  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(content?: any) {
    this.operationType = content?.operationType || '';
    this.npnlike = content?.npnlike || '';
    this.appliedAlfa = content?.appliedAlfa || false;
    this.baunitHead = content?.baunitHead || '';
    this.appliedGeo = content?.appliedGeo || false;
  }

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

  get cadastralNumber(): string {
    return this.baunitHead?.cadastralNumber || '';
  }

  get cadastralArea(): number {
    return this.baunitHead?.cadastralArea || 0;
  }

  get domBaunitCondition(): string {
    return this.baunitHead?.domBaunitCondition || '';
  }

  get domBaunitEconoDesti(): string {
    return this.baunitHead?.domBaunitEconoDesti || '';
  }

  get baunitIdE(): string {
    return this.baunitHead?.baunitIdE || '';
  }

}
