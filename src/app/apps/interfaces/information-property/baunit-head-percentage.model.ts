import { BaunitHead } from './baunit-head.model';

export class BaUnitHeadPercentage {
  baunitHead?: BaunitHead | null;
  cadastralNumber?: string;
  cadastralAreaE?: string;
  domBaunitCondition?: string;
  domBaunitEconoDesti?: string;
  registration?: string;
  percentageGroup?: number;
  operationType?: string;
  baunitIdE?: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  constructor(content?: any) {
    this.baunitHead = content?.baunitHead ? new BaunitHead(content?.baunitHead) : null;
    this.cadastralNumber = content?.baunitHead?.cadastralNumber || '';
    this.cadastralAreaE = content?.baunitHead?.cadastralAreaE || '';
    this.domBaunitCondition = content?.baunitHead?.domBaunitCondition || '';
    this.domBaunitEconoDesti = content?.baunitHead?.domBaunitEconoDesti || '';
    this.percentageGroup = content?.percentageGroup || 0;
    this.operationType = content?.operationType || '';
    this.baunitIdE = content?.baunitHead?.baunitIdE || '';

    if (this.baunitHead?.propertyRegistryOffice && this.baunitHead?.propertyRegistryOffice.length > 0 &&
      this.baunitHead?.propertyRegistryNumber && this.baunitHead?.propertyRegistryNumber.length > 0) {
      this.registration = `${this.baunitHead?.propertyRegistryOffice} - ${this.baunitHead?.propertyRegistryNumber}`;
    } else if (this.baunitHead?.propertyRegistryOffice && this.baunitHead?.propertyRegistryOffice.length > 0) {
      this.registration = `${this.baunitHead?.propertyRegistryOffice}`;
    } else if (this.baunitHead?.propertyRegistryNumber && this.baunitHead?.propertyRegistryNumber.length > 0) {
      this.registration = `${this.baunitHead?.propertyRegistryNumber}`;
    }
  }
}
