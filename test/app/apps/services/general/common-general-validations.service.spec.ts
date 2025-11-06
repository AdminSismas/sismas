import { TestBed } from '@angular/core/testing';
import { CommonGeneralValidationsService } from '@shared/services/general/common-general-validations.service';

describe(CommonGeneralValidationsService.name, () => {
  let service: CommonGeneralValidationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CommonGeneralValidationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
