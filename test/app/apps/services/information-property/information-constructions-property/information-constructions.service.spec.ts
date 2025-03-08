import { TestBed } from '@angular/core/testing';
import {
  InformationConstructionsService
} from '../../../../../../src/app/apps/services/information-property/information-constructions-property/information-constructions.service';

describe(InformationConstructionsService.name, () => {
  let service: InformationConstructionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationConstructionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
