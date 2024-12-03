import { TestBed } from '@angular/core/testing';

import { InformationZonesService } from './information-zones.service';

describe('InformationZonesService', () => {
  let service: InformationZonesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationZonesService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
