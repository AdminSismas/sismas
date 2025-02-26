import { TestBed } from '@angular/core/testing';
import { ValidateInformationBaunitService } from 'src/app/apps/services/general/validate-information-baunit.service';


describe(ValidateInformationBaunitService.name, () => {
  let service: ValidateInformationBaunitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateInformationBaunitService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
