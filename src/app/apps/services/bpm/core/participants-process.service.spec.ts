import { TestBed } from '@angular/core/testing';

import { ParticipantsProcessService } from './participants-process.service';

describe('ParticipantsProcessService', () => {
  let service: ParticipantsProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantsProcessService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
