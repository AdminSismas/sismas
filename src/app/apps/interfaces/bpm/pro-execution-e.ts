import { MetadataBpm } from '@shared/interfaces';
import { ProcessParticipant } from '@shared/interfaces';

export class ProExecutionE {
  processId:number;
  participations:ProcessParticipant[];
  metadataList:MetadataBpm[];
  attachmentsList:string[];


  constructor(processId: number, participations: ProcessParticipant[],
              metadataList: MetadataBpm[], attachmentsList: string[]) {
    this.processId = processId;
    this.participations = participations;
    this.metadataList = metadataList;
    this.attachmentsList = attachmentsList;
  }
}
