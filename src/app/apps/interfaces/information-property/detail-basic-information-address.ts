export class DetailBasicInformationAddress {
  direccionId?: string;
  esDireccionPrincipal?: string;
  codigoPostal?: string;
  valorViaPrincipal?: string;
  letraViaPrincipal?: string;
  letraViaGeneradora?: string;
  valorViaGeneradora?: string;
  numeroPredio?: string;
  complemento?: string;
  nombrePredio?: string;
  domTipoDireccion?: string;
  domClaseViaPrincipal?: string;
  domSectorCiudad?: string;
  domSectorPredio?: string;
  direccionTexto?: string;


  constructor(content?: any) {
    this.direccionId = content.direccionId;
    this.esDireccionPrincipal = content.esDireccionPrincipal;
    this.codigoPostal = content.codigoPostal;
    this.valorViaPrincipal = content.valorViaPrincipal;
    this.letraViaPrincipal = content.letraViaPrincipal;
    this.letraViaGeneradora = content.letraViaGeneradora;
    this.valorViaGeneradora = content.valorViaGeneradora;
    this.numeroPredio = content.numeroPredio;
    this.complemento = content.complemento;
    this.nombrePredio = content.nombrePredio;
    this.domTipoDireccion = content.domTipoDireccion;
    this.domClaseViaPrincipal = content.domClaseViaPrincipal;
    this.domSectorCiudad = content.domSectorCiudad;
    this.domSectorPredio = content.domSectorPredio;
    this.direccionTexto = content.direccionTexto;
  }
}

export interface CreateBasicInformationAddress {
  esDireccionPrincipal: boolean;
  codigoPostal: string;
  valorViaPrincipal: string;
  letraViaPrincipal: string;
  letraViaGeneradora: string;
  valorViaGeneradora: string;
  numeroPredio: string;
  complemento: string;
  nombrePredio: string;
  domTipoDireccion: string;
  domClaseViaPrincipal: string;
  domSectorCiudad: string;
  domSectorPredio: string;
}
