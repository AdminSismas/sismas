import { GUION } from '../../constants/constant';

export class Department {
  divpolLvl1Code: string | undefined;
  divpolLvl1Name: string | undefined;
  divpolLvl1SecCode: string | undefined;

  constructor(content?: any) {
    this.divpolLvl1Code = content.divpolLvl1Code;
    this.divpolLvl1Name = content.divpolLvl1Name;
    this.divpolLvl1SecCode = content.divpolLvl1SecCode;
  }

  set codeName(value: string) {
  }

  get codeName(): string {
    let name = '';
    if (this.divpolLvl1Code && this.divpolLvl1Name) {
      return `${this.divpolLvl1Code}${GUION}${this.divpolLvl1Name}`;
    } else if (this.divpolLvl1Code) {
      return `${this.divpolLvl1Code}`;
    } else if (this.divpolLvl1Name) {
      return `${this.divpolLvl1Name}`;
    }
    return name;
  }
}
