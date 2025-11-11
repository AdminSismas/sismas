import { TestBed } from '@angular/core/testing';
import {
  InformationPropertyService
} from '@features/property-management/services/property/information-property.service';

describe(InformationPropertyService.name, () => {
  let service: InformationPropertyService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationPropertyService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
