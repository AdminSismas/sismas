// Tenant configuration models barrel exports

// Tenant Configuration
export * from './tenant-config.interface';

// Users - Export principal interfaces only (avoiding duplicates)
export type { UsersSignatures } from '../../configuration/interfaces/users/digitalized-signatures';
export * from '../../configuration/interfaces/users/people.model';
export type {
  InformationPageableUser,
  User,
  Authority,
  Role,
  Individual,
  AtedBy,
  DOMIndividualType,
  DOMIndividualTypeNumber,
  CreateUserDialogData,
  CreateUserParams,
  CreateOutput,
  Pageable,
  Sort
} from '../../configuration/interfaces/users/user';
export * from '../../configuration/interfaces/users/user-details.model';
