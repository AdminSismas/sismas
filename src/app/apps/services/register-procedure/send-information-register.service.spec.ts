import { TestBed } from '@angular/core/testing';

import { SendInformationRegisterService } from './send-information-register.service';

describe('SendInformationRegisterService', () => {
  let service: SendInformationRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendInformationRegisterService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
