import { Individual } from './individual';

export interface GrantedAuthority {
  authority?:string;
}

export interface ProcessUser {
  userId?:number;
  username?:string;
  email?:string;
  emailValidAt?:string;
  validBeginAt?:string;
  validToAt?:string;
  individual: Individual;
  role?:string;
  enabled?:boolean;
  accountNonExpired?:boolean;
  authorities: GrantedAuthority[],
  credentialsNonExpired: true,
  accountNonLocked: true
}
