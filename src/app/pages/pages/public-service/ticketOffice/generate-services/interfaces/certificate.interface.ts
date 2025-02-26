
export class Certificate {
  id: number;
  name: string;
  price: number;
  icon: string;
  type: string;


  constructor(certificate: any) {
    this.id = certificate.id;
    this.name = certificate.name;
    this.price = certificate.price;
    this.icon = certificate.icon;
    this.type = certificate.type;
  }

}
