import { TestBed } from '@angular/core/testing';
import { BpmCoreService } from '../../../../../src/app/apps/services/bpm/bpm-core.service';

describe(BpmCoreService.name, () => {
  let service: BpmCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmCoreService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
