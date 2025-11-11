import { InfoPerson } from '@features/property-management/models/info-person';
import { GovernmentalChannel } from '@features/bpm-workflows/models/governmental-channel';
import { ProcessParticipantTableMenu } from '@features/bpm-workflows/models/citation-and-notice/info-participants.interface';

export class ProcessParticipant {

  participationId: number;
  bpmParticipation: string;
  imageSrc: string;
  individual: InfoPerson;
  viaGubernativa?: GovernmentalChannel;
  selected?: boolean = false;
  executionId?: string | null = null;
  typeCategory?: ProcessParticipantTableMenu['id']| null = null;

  constructor(content?: any) {
    this.participationId = content?.participationId || 0;
    this.bpmParticipation = content?.bpmParticipation || '';
    this.individual = content?.individual || null;
    this.viaGubernativa = content?.viaGubernativa || null;
    this.selected = content?.selected || false;
    this.imageSrc = content?.imageSrc || '';
  }

  set fullName(value: string) {
  }

  get fullName(): string {
    const name = '';
    if (this.individual?.fullName) {
      return `${this.individual.fullName}`;
    }
    return name;
  }

  set individualNumber(value: string) {
  }

  get individualNumber(): string {
    const name = '';
    if (this.individual?.number) {
      return `${this.individual.number}`;
    }
    return name;
  }

  set individualUpdatedAt(value: string) {
  }

  get individualUpdatedAt(): string {
    const name = '';
    if (this.individual?.updatedAt) {
      return `${this.individual.updatedAt}`;
    }
    return name;
  }

  set typeProcessParticipant(value: string) {
  }

  get typeProcessParticipant(): string {
    const name = 'SI';
    if (this.individual?.companyName) {
      return 'NO';
    }
    return name;
  }
}
