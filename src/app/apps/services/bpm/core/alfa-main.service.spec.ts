import { TestBed } from '@angular/core/testing';

import { AlfaMainService } from './alfa-main.service';

describe('AlfaMainService', () => {
  let service: AlfaMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlfaMainService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
