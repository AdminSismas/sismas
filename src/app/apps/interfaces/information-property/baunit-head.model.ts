export class BaunitHead {
  baunitIdE?: string;
  propertyRegistryOffice?: string;
  propertyRegistryNumber?: string;
  cadastralNumber?: string;
  cadastralArea?: number;
  cadastralRegistryNumber?: string;
  domBaunitCondition?: string;
  domBaunitEconoDesti?: string;


  constructor(content?: any) {
    this.baunitIdE = content.baunitIdE || '';
    this.propertyRegistryOffice = content.propertyRegistryOffice || '';
    this.propertyRegistryNumber = content.propertyRegistryNumber || '';
    this.cadastralNumber = content.cadastralNumber || '';
    this.cadastralArea = content.cadastralArea || 0;
    this.cadastralRegistryNumber = content.cadastralRegistryNumber || '';
    this.domBaunitCondition = content.domBaunitCondition || '';
    this.domBaunitEconoDesti = content.domBaunitEconoDesti || '';
  }

  set registration(value:string) {}

  get registration(): string {
    let name = '';
    if (this.propertyRegistryOffice && this.propertyRegistryNumber) {
      return `${this.propertyRegistryOffice} - ${this.propertyRegistryNumber}`;
    } else if (this.propertyRegistryOffice) {
      return `${this.propertyRegistryOffice}`;
    } else if (this.propertyRegistryNumber) {
      return `${this.propertyRegistryNumber}`;
    }
    return name;
  }
}
