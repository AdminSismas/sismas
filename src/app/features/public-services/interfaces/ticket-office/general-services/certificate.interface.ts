import { ComponentType } from "@angular/cdk/portal";

export class Certificate {
  id: number;
  name: string;
  price: number;
  icon: string;
  type: string;
  component: ComponentType<any>;


  constructor(certificate: any) {
    this.id = certificate.id;
    this.name = certificate.name;
    this.price = certificate.price;
    this.icon = certificate.icon;
    this.type = certificate.type;
    this.component = certificate.component;
  }
}

export interface CertificateDialogData {
  certificate: Certificate;
  openSearch?: boolean;
}
