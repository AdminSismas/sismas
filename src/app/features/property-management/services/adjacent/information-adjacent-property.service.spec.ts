import { TestBed } from '@angular/core/testing';

import { InformationAdjacentPropertyService } from '@features/property-management/services/adjacent/information-adjacent-property.service';

describe('InformationAdjacentPropertyService', () => {
  let service: InformationAdjacentPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationAdjacentPropertyService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
