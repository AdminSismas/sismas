export class NationalPredialNumber {
  department?: string;
  municipality?: string;
  zone?: string;
  sector?: string;
  community?: string;
  neighborhood?: string;
  blockSidewalk?: string;
  property?: string;
  condition?: string;
  building?: string;
  floor?: string;
  propertyUnit?: string;


  constructor(department?: string, municipality?: string, zone?: string, sector?: string,
              community?: string, neighborhood?: string, blockSidewalk?: string,
              property?: string, condition?: string, building?: string, floor?: string,
              propertyUnit?: string) {
    this.department = department;
    this.municipality = municipality;
    this.zone = zone;
    this.sector = sector;
    this.community = community;
    this.neighborhood = neighborhood;
    this.blockSidewalk = blockSidewalk;
    this.property = property;
    this.condition = condition;
    this.building = building;
    this.floor = floor;
    this.propertyUnit = propertyUnit;
  }
}
