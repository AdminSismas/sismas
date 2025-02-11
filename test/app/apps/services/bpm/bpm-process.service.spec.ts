import { TestBed } from '@angular/core/testing';
import { BpmProcessService } from '../../../../../src/app/apps/services/bpm/bpm-process.service';


describe(BpmProcessService.name, () => {
  let service: BpmProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmProcessService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
