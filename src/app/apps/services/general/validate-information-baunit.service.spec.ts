import { TestBed } from '@angular/core/testing';

import { ValidateInformationBaunitService } from './validate-information-baunit.service';

describe('ValidateInformationBaunitService', () => {
  let service: ValidateInformationBaunitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ValidateInformationBaunitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
