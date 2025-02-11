import { TestBed } from '@angular/core/testing';
import { RrrightService } from '../../../../../src/app/apps/services/bpm/rrright.service';


describe(RrrightService.name, () => {
  let service: RrrightService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(RrrightService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});

