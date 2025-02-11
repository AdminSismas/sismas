import { TestBed } from '@angular/core/testing';
import { SyncMainService } from 'src/app/apps/services/bpm/sync-main.service';


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

