export class InfoContact {
  individualId: number;
  divpolLv1: string;
  divpolLv2: string;
  divpolLv3: string | null;
  country: string;
  phoneNumber: string | null;
  email: string;
  address: string;
  addressNotification: string | null;
  notificationByEmail: boolean | null;

  constructor(content?: any) {
    this.individualId = content?.individualId ?? -55;
    this.divpolLv1 = content?.divpolLv1 ?? '';
    this.divpolLv2 = content?.divpolLv2 ?? '';
    this.divpolLv3 = content?.divpolLv3;
    this.country = content?.country ?? '';
    this.phoneNumber = content?.phoneNumber ?? null;
    this.email = content?.email ?? '';
    this.address = content?.address ?? '';
    this.addressNotification = content?.addressNotification ?? null;
    this.notificationByEmail = content?.notificationByEmail ?? false;
  }
}

