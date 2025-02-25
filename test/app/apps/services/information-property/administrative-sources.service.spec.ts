import { TestBed } from "@angular/core/testing";
import {
  AdministrativeSourcesService
} from '../../../../../src/app/apps/services/information-property/administrative-sources.service';

describe(AdministrativeSourcesService.name, () => {
  let service: AdministrativeSourcesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AdministrativeSourcesService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

});
