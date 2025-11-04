import { TestBed } from '@angular/core/testing';
import { CommonGeneralValidationsService } from '@shared/services';

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
