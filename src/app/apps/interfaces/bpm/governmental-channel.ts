export class GovernmentalChannel {
  guvId?:number;
  domGuvType?:string;
  guvName?:string;
  guvDocument?:string;
  guvFileNumber?: string;
  guvFileDate?: string;
  domCitationMethods?:string;
  citationNote?:string;
  citationDate?: string;
  domNotificationMethods?:string;
  notificationNote?:string;
  resignationTerms?:boolean;
  notificationDate?:string;
  noticePostDate?:string;
  noticeRemoveDate?:string;

  constructor(content?: any) {
    this.guvId = content.guvId || 0;
    this.domGuvType = content.domGuvType || '';
    this.guvName = content.guvName || '';
    this.guvDocument = content.guvDocument || '';
    this.guvFileNumber = content.guvFileNumber || 0;
    this.guvFileDate = content.guvFileDate || '';
    this.domCitationMethods = content.domCitationMethods || '';
    this.citationNote = content.citationNote || '';
    this.citationDate = content.citationDate || '';
    this.domNotificationMethods = content.domNotificationMethods || '';
    this.notificationNote = content.notificationNote || '';
    this.resignationTerms = content.resignationTerms || '';
    this.notificationDate = content.notificationDate || '';
    this.noticePostDate = content.noticePostDate || '';
    this.noticeRemoveDate = content.noticeRemoveDate || '';
  }
}
