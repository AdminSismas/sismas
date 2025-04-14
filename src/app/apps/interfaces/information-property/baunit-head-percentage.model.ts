import { BaunitHead } from './baunit-head.model';

export class BaUnitHeadPercentage {
  baunitHead?: BaunitHead | null;
  percentageGroup?: number;

  constructor(content?: any) {
    this.baunitHead = content?.baunitHead ? new BaunitHead(content?.baunitHead) : null;
    this.percentageGroup = content?.percentageGroup || 0;
  }

  set cadastralNumber(value:string) {}

  get cadastralNumber(): string {
    return `${this.baunitHead?.cadastralNumber}`;
  }

  set cadastralAreaE(value:string) {}

  get cadastralAreaE(): string {
    return `${this.baunitHead?.cadastralAreaE}`;
  }

  set domBaunitCondition(value:string) {}

  get domBaunitCondition(): string {
    return `${this.baunitHead?.domBaunitCondition}`;
  }

  set domBaunitEconoDesti(value:string) {}

  get domBaunitEconoDesti(): string {
    return `${this.baunitHead?.domBaunitEconoDesti}`;
  }

  set registration(value:string) {}

  get registration(): string {
    const name = '';
    if (this.baunitHead?.propertyRegistryOffice && this.baunitHead?.propertyRegistryOffice.length > 0 &&
      this.baunitHead?.propertyRegistryNumber && this.baunitHead?.propertyRegistryNumber.length > 0) {
      return `${this.baunitHead?.propertyRegistryOffice} - ${this.baunitHead?.propertyRegistryNumber}`;
    } else if (this.baunitHead?.propertyRegistryOffice && this.baunitHead?.propertyRegistryOffice.length > 0) {
      return `${this.baunitHead?.propertyRegistryOffice}`;
    } else if (this.baunitHead?.propertyRegistryNumber && this.baunitHead?.propertyRegistryNumber.length > 0) {
      return `${this.baunitHead?.propertyRegistryNumber}`;
    }
    return name;
  }
}
