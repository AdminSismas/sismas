import { BpmProcessService } from '../../../../../src/app/apps/services/bpm/bpm-process.service';
import { SendGeneralRequestsService } from '../../../../../src/app/apps/services/general/send-general-requests.service';
import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { environment } from '../../../../../src/environments/environments';

describe(BpmProcessService.name, () => {
  let service: BpmProcessService;
  let requestsService: SendGeneralRequestsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule, environment],
      providers: [BpmProcessService]
    });
    service = TestBed.inject(BpmProcessService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('#getValue should return real value from the real service', () => {
    service = new BpmProcessService(requestsService);
    expect(service.getListDocumentsByProcessId('selectBpmProcess')).toBe('real value');
  });

});
