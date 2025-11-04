import { TestBed } from '@angular/core/testing';
import { ValidateInformationBaunitService } from '@shared/services';


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
