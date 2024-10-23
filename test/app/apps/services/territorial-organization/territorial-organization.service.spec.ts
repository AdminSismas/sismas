import { TerritorialOrganizationService } from '../../../../../src/app/apps/services/territorial-organization/territorial-organization.service';
import { TestBed } from '@angular/core/testing';

describe(TerritorialOrganizationService.name, () => {
  let service: TerritorialOrganizationService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TerritorialOrganizationService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
