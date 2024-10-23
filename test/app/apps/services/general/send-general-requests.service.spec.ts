import { TestBed } from '@angular/core/testing';

import { SendGeneralRequestsService } from '../../../../../src/app/apps/services/general/send-general-requests.service';
import { HttpClientModule } from '@angular/common/http';

describe(SendGeneralRequestsService.name, () => {
  let service: SendGeneralRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(SendGeneralRequestsService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

});
