import { TestBed } from '@angular/core/testing';
import {
  GeneralValidationsService
} from '../../../../../src/app/shared/services/general/validations/general-validations.service';

describe(GeneralValidationsService.name, () => {
  let service: GeneralValidationsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(GeneralValidationsService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
