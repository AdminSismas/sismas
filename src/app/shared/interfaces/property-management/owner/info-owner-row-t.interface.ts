import { InfoOwners } from '@shared/models';
import { InfoPerson } from "@shared/models";

export type InfoOwnerRowT = Pick<
  InfoOwners,
  'rightId' | 'beginAt' | 'fractionS' | 'domRightType'
> &
  Pick<InfoPerson, 'domIndividualTypeNumber' | 'number' | 'fullName'>;
