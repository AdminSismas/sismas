export class ChangeControl {
  changeLogId?:number;
  resolution?:string;
  resolutionAt?:string;
  rooting?:string;
  rootingAt?:string;
  validity?:string;
  beginAt?:string;
  domCadastreChangeTypeDescription?:string;


  constructor(content?: any) {
    this.changeLogId = content?.changeLogId || 0;
    this.resolution = content?.resolution || '';
    this.resolutionAt = content?.resolutionAt || '';
    this.rooting = content?.rooting || '';
    this.rootingAt = content?.rootingAt || '';
    this.validity = content?.validity || '';
    this.beginAt = content?.beginAt || '';
    this.domCadastreChangeTypeDescription = content?.domCadastreChangeTypeDescription || '';
  }
}
