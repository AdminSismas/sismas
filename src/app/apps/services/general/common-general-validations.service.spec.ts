import { TestBed } from '@angular/core/testing';

import { CommonGeneralValidationsService } from './common-general-validations.service';

describe('CommonGeneralValidationsService', () => {
  let service: CommonGeneralValidationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonGeneralValidationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
