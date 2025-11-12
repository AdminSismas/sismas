import { TestBed } from '@angular/core/testing';
import { SnrService } from '@features/property-management/services/snr/snr.service';

describe(SnrService.name, () => {
  let service: SnrService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SnrService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});

