import { InfoPerson } from '../information-property/info-person';
import { GovernmentalChannel } from './governmental-channel';

export class ProcessParticipant {
  participationId: number;
  bpmParticipation: string;
  imageSrc: string = 'assets/img/avatars/1.jpg';
  individual: InfoPerson;
  viaGubernativa?: GovernmentalChannel;
  selected?: boolean = false;


  constructor(content?: any) {
    this.participationId = content?.participationId || 0;
    this.bpmParticipation = content?.bpmParticipation || '';
    this.individual = content?.individual || null;
    this.viaGubernativa = content?.viaGubernativa || null;
    this.selected = content?.selected || false;
    this.imageSrc = 'assets/img/avatars/1.jpg';
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
    let name = '';
    if (this.individual?.updatedAt) {
      return `${this.individual.updatedAt}`;
    }
    return name;
  }

  set typeProcessParticipant(value: string) {
  }

  get typeProcessParticipant(): string {
    let name = 'SI';
    if (this.individual?.companyName) {
      return 'NO';
    }
    return name;
  }
}
