import { TestBed } from '@angular/core/testing';
import { UnitPropertyInformationService } from 'src/app/apps/services/territorial-organization/baunit-children-information.service';


describe(UnitPropertyInformationService.name, () => {
  let service: UnitPropertyInformationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UnitPropertyInformationService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
