export class BasicDetailGroup {

  buildNumber?: number;
  floorNumber?: number;
  percentageGroupS?: string;
  percentage_group?: number;
  unitNumber?: number;
  masterGroupE?: string;

  constructor(content?: any) {
    this.buildNumber = content?.buildNumber || 0;
    this.floorNumber = content?.floorNumber || 0;
    this.percentageGroupS = content?.percentageGroupS || '';
    this.percentage_group = content?.percentage_group || 0;
    this.unitNumber = content?.unitNumber || 0;
    this.masterGroupE = content?.masterGroupE || '';
  }
}
