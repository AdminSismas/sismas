import { TestBed } from '@angular/core/testing';

import { BpmProcessService } from './bpm-process.service';

describe('BpmProcessService', () => {
  let service: BpmProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(BpmProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
