import { TestBed } from '@angular/core/testing';
import {
  InformationGeographicService
} from '../../../../../src/app/apps/services/geographics/information-geographic.service';

describe(InformationGeographicService.name, () => {
  let service: InformationGeographicService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationGeographicService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
