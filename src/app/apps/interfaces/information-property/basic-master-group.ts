export class BasicMasterGroup {
  commonBuiltArea?: number;
  commonLandArea?: number;
  numberBaunits?: number;
  numberBuildings?: number;
  privateBuiltArea?: number;
  privateLandArea?: number;
  totalBuiltArea?: number;
  totalLandArea?: number;

  constructor(content?: any) {
    this.commonBuiltArea = content?.commonBuiltArea || 0;
    this.commonLandArea = content?.commonLandArea || 0;
    this.numberBaunits = content?.numberBaunits || 0;
    this.numberBuildings = content?.numberBuildings || 0;
    this.privateBuiltArea = content?.privateBuiltArea || 0;
    this.privateLandArea = content?.privateLandArea || 0;
    this.totalBuiltArea = content?.totalBuiltArea || 0;
    this.totalLandArea = content?.totalLandArea || 0;
  }
}
