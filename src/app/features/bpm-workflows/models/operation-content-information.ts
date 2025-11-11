import { InformationPegeable } from '@shared/models/pageable';

export class OperationContentInformation {
  npnlike:string;
  contentInformations: InformationPegeable;


  constructor(npnlike: string, contentInformations: InformationPegeable= new InformationPegeable()) {
    this.npnlike = npnlike;
    this.contentInformations = contentInformations;
  }
}
