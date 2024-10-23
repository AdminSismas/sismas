import { InfoPerson } from '../information-property/info-person';

export class ProcessParticipant {
  participationId:number;
  bpmParticipation:string;
  individual:InfoPerson;


  constructor(content?:any) {
    this.participationId = content?.participationId || 0;
    this.bpmParticipation = content?.bpmParticipation || '';
    this.individual = content?.individual || null;
  }

  set fullName(value:string) {}

  get fullName(): string {
    let name = '';
    if (this.individual?.fullName) {
      return `${this.individual.fullName}`;
    }
    return name;
  }

  set individualNumber(value:string) {}

  get individualNumber(): string {
    let name = '';
    if (this.individual?.number) {
      return `${this.individual.number}`;
    }
    return name;
  }
}
