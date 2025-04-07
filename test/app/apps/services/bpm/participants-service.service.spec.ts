import { TestBed } from '@angular/core/testing';

import { ParticipantsServiceService } from './participants-service.service';

describe('ParticipantionServiceService', () => {
  let service: ParticipantsServiceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ParticipantsServiceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
