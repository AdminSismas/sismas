export class GovernmentalChannel {
  guvId?:number;
  domGuvState?:string;
  guvDateEndTerms?:string;
  domIndividualTypeNumber?:string;
  individualName?: string;
  individualNumber?: string;
  domCitationMethod?:string;
  citationNote?:string;
  citationDate?: string;
  domNotificationMethod?:string;
  notificationNote?:string;
  resignationTerms?:boolean;
  notificationDate?:string;
  noticePostDate?:string;
  noticeRemoveDate?:string;

  constructor(content?: any) {
    this.guvId = content.guvId || 0;
    this.domGuvState = content.domGuvState || '';
    this.guvDateEndTerms = content.guvDateEndTerms || '';
    this.domIndividualTypeNumber = content.domIndividualTypeNumber || '';
    this.individualName = content.individualName || 0;
    this.individualNumber = content.individualNumber || '';
    this.domCitationMethod = content.domCitationMethod || '';
    this.citationNote = content.citationNote || '';
    this.citationDate = content.citationDate || '';
    this.domNotificationMethod = content.domNotificationMethod || '';
    this.notificationNote = content.notificationNote || '';
    this.resignationTerms = content.resignationTerms || '';
    this.notificationDate = content.notificationDate || '';
    this.noticePostDate = content.noticePostDate || '';
    this.noticeRemoveDate = content.noticeRemoveDate || '';
  }
}
