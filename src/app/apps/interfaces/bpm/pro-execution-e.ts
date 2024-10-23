import { MetadataBpm } from './metadata-bpm';
import { ProcessParticipant } from './process-participant';

export class ProExecutionE {
  processId:number;
  participations:ProcessParticipant[];
  metadataList:MetadataBpm[];
  attachmentsList:string[]


  constructor(processId: number, participations: ProcessParticipant[],
              metadataList: MetadataBpm[], attachmentsList: string[]) {
    this.processId = processId;
    this.participations = participations;
    this.metadataList = metadataList;
    this.attachmentsList = attachmentsList;
  }
}
