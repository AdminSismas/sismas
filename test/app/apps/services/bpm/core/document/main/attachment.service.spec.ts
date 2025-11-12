import { TestBed } from '@angular/core/testing';
import { TerritorialOrganizationService } from '@shared/services/general/territorial-organization/territorial-organization.service';

describe(AttachmentService.name, () => {
  let service: AttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachmentService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
