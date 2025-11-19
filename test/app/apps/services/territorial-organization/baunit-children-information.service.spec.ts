import { TestBed } from '@angular/core/testing';
import { UnitPropertyInformationService } from '@features/bpm-workflows/services/modification-property-units/baunit-children-information.service';


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
