import { ProcessParticipant } from '@features/bpm-workflows/models/process-participant';
import { MetadataBpm } from '@features/tasks/models';

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
