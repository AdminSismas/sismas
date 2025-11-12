import { TypesQualificationUB } from '@features/property-management/models';

export class CcCalificacionUB {
  id?: number;
  ccCalUBDom?: TypesQualificationUB;
  points?: number;


  constructor(id: number, ccCalUBDom: TypesQualificationUB, points: number) {
    this.id = id;
    this.ccCalUBDom = ccCalUBDom;
    this.points = points;
  }
}
