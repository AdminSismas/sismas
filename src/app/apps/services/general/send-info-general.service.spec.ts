import { TestBed } from '@angular/core/testing';

import { SendInfoGeneralService } from './send-info-general.service';

describe('SendInfoGeneralService', () => {
  let service: SendInfoGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendInfoGeneralService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
