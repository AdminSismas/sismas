import { InfoOwners } from '@shared/models';
import { InfoPerson } from '@features/property-management/models/info-person';

export type InfoOwnerRowT = Pick<
  InfoOwners,
  'rightId' | 'beginAt' | 'fractionS' | 'domRightType'
> &
  Pick<InfoPerson, 'domIndividualTypeNumber' | 'number' | 'fullName'>;
