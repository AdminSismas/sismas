import { TestBed } from '@angular/core/testing';
import { SyncMainService } from '@features/bpm-workflows/services/core/sync-main.service';


describe(SyncMainService.name, () => {
  let service: SyncMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SyncMainService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});

