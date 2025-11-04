import { TestBed } from '@angular/core/testing';
import {
  InformationGeographicService
} from '../../../../../src/app/features/bpm-workflows/services/alfa-main/information-geographic.service';

describe(InformationGeographicService.name, () => {
  let service: InformationGeographicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationGeographicService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
