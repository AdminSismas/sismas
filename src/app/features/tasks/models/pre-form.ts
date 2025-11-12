
export class PreForm {
  preformId?: number;
  name?: string;
  pathForm?: string;
  params?: string;


  constructor(content?:any) {
    this.preformId = content.preformId || 0;
    this.name = content.name || '';
    this.pathForm = content.pathForm || '';
    this.params = content.params || '';
  }
}
