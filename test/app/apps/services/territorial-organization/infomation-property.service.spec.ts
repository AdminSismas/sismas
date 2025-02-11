import { TestBed } from '@angular/core/testing';
import { InformationPropertyService } from '../../../../../src/app/apps/services/territorial-organization/information-property.service';

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
