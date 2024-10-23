import { TestBed } from '@angular/core/testing';

import { InformationPersonService } from './information-person.service';

describe('InformationPersonService', () => {
  let service: InformationPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationPersonService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
