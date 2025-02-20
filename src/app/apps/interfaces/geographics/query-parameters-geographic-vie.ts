export class QueryParametersGeographicVie {
  page?: string;
  map?: string;
  featureinfo?: string;
  bbox?: string;
  center?: string;
  zoom?: number;
  actions?: string;
  base_url?: string;


  constructor(content?: any) {
    this.page = content?.page || '';
    this.map = content?.map || '';
    this.featureinfo = content?.featureinfo || '';
    this.bbox = content?.bbox || '';
    this.center = content?.center || '';
    this.zoom = content?.zoom || 0;
    this.actions = content?.actions || '';
    this.base_url = content?.base_url || '';
  }
}
