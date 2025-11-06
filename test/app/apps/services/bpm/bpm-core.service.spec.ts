import { TestBed } from '@angular/core/testing';
import { BpmCoreService } from '@features/bpm-workflows/services/core/bpm-core.service';

describe(BpmCoreService.name, () => {
  let service: BpmCoreService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmCoreService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
