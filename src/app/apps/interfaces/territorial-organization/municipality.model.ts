import { GUION } from '../../constants/constant';

export class Municipality {
  fkDivpolLvl1Code: string;
  divpolLvl2Code: string;
  divpolLvl2Name: string;
  divpolLvl2SecCode: string;


  constructor(content?: any) {
    this.fkDivpolLvl1Code = content.fkDivpolLvl1Code;
    this.divpolLvl2Code = content.divpolLvl2Code;
    this.divpolLvl2Name = content.divpolLvl2Name;
    this.divpolLvl2SecCode = content.divpolLvl2SecCode;
  }


  set codeName(value: string) {
  }

  get codeName(): string {
    const name = '';
    if (this.divpolLvl2SecCode && this.divpolLvl2Name) {
      return `${this.divpolLvl2SecCode}${GUION}${this.divpolLvl2Name}`;
    } else if (this.divpolLvl2SecCode) {
      return `${this.divpolLvl2SecCode}`;
    } else if (this.divpolLvl2Name) {
      return `${this.divpolLvl2Name}`;
    }
    return name;
  }
}
