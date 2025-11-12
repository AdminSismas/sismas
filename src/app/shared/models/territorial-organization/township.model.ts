
export class Township {
  divpolLvl2Code: string;
  divpolLvl3Code: string;
  divpolLvl3Name: string;
  divpolLvl3SecCode: string;


  constructor(divpolLvl2Code: string, divpolLvl3Code: string,
              divpolLvl3Name: string, divpolLvl3SecCode: string) {
    this.divpolLvl2Code = divpolLvl2Code;
    this.divpolLvl3Code = divpolLvl3Code;
    this.divpolLvl3Name = divpolLvl3Name;
    this.divpolLvl3SecCode = divpolLvl3SecCode;
  }
}
