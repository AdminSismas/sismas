export class SearchData {

  dpto?:string;
  mpio?:string;
  zonas?:string;
  sectorb?:string;
  comuna?:string;
  barrio?:string;
  manVer?:string;
  terreno?:string;
  condicion?:string;
  edificio?:string;
  piso?:string;
  unidadPredial?:string;

  registration?: string;
  number?: string;
  domIndividualTypeNumber?: string;
  firstName?: string;
  middleName?: string;
  lastName?: string;
  otherLastName?: string;
  companyName?: string;
  textAddress?: string;
  department?: string | undefined | null;
  municipality?: string | undefined | null;
  zone?: string | undefined | null;
  sector?: string | null | undefined;
  community?: string | null | undefined;
  neighborhood?: string | null | undefined;
  block?: string | null | undefined;
  sidewalk?: string | null | undefined;


  constructor(content?: any) {
    if (content.registration) this.registration = content.registration.trim();
    if (content.number) this.number = content.number.trim();
    if (content.domIndividualTypeNumber) this.domIndividualTypeNumber = content.domIndividualTypeNumber.trim();
    if (content.firstName) this.firstName = content.firstName.trim();
    if (content.middleName) this.middleName = content.middleName.trim();
    if (content.lastName) this.lastName = content.lastName.trim();
    if (content.otherLastName) this.otherLastName = content.otherLastName.trim();
    if (content.companyName) this.companyName = content.companyName.trim();
    if (content.textAddress) this.textAddress = content.textAddress.trim();
    if (content.department) this.department = content.department.trim();
    if (content.municipality) this.municipality = content.municipality.trim();
    if (content.zone) this.zone = content.zone.trim();
    if (content.sector) this.sector = content.sector.trim();
    if (content.community) this.community = content.community.trim();
    if (content.neighborhood) this.neighborhood = content.neighborhood.trim();
    if (content.block) this.block = content.block.trim();
    if (content.sidewalk) this.sidewalk = content.sidewalk.trim();
  }
}
