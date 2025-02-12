import { TestBed } from '@angular/core/testing';
import { InformationZonesService } from 'src/app/apps/services/information-property/information-zones-property/information-zones.service';

describe(InformationZonesService.name, () => {
  let service: InformationZonesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationZonesService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
