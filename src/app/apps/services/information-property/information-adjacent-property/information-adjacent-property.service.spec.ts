import { TestBed } from '@angular/core/testing';

import { InformationAdjacentPropertyService } from './information-adjacent-property.service';

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
