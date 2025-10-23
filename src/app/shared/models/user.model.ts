import { InfoPerson } from './info-person';

export class UserDetails {
  userId: number;
  username: string;
  email: string;
  emailValidAt: string | null;
  validBeginAt: string;
  validToAt: string;
  individual: InfoPerson;
  role: string;
  enabled: boolean | string;
  accountNonExpired: boolean;
  authorities: Authority[];
  accountNonLocked: boolean;
  credentialsNonExpired: boolean;

  constructor(content?: any) {
    this.userId = content.userId || 0;
    this.username = content.username || '';
    this.email = content.email || '';
    this.emailValidAt = content.emailValidAt || '';
    this.validBeginAt = content.validBeginAt || '';
    this.validToAt = content.validToAt || '';
    this.individual = new InfoPerson(content.individual);
    this.role = content.role || '';
    this.enabled = content.enabled || false;
    this.accountNonExpired = content.accountNonExpired || false;
    this.authorities = content.authorities.map((auth: any) => new Authority(auth));
    this.accountNonLocked = content.accountNonLocked || false;
    this.credentialsNonExpired = content.credentialsNonExpired || false;
  }
}

export class Authority {
  authority: string;

  constructor(data: any) {
    this.authority = data.authority;
  }
}

export type UserRole = 'ADMIN' | 'USER_LEAD' | 'GUEST' | 'USER_READ' | 'USER_SERV' | 'USER';

export interface DecodeJwt {
  sub: string;
  role: UserRole;
  exp: number;
  iat: number;
}
