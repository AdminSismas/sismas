import { TestBed } from '@angular/core/testing';

import { InformationConstructionsService } from './information-constructions.service';

describe('InformationConstructionsService', () => {
  let service: InformationConstructionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationConstructionsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
