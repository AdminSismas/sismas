import { BpmProcessService } from '../../../../../src/app/apps/services/bpm/bpm-process.service';
import { TestBed } from '@angular/core/testing';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../../../../src/environments/environments';

describe(BpmProcessService.name, () => {
  let service: BpmProcessService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClient, environment],
      providers: [BpmProcessService]
    });
    service = TestBed.inject(BpmProcessService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

  test('#getValue should return real value from the real service', () => {

    expect(service.getListDocumentsByProcessId('selectBpmProcess')).toBe('real value');
  });

});
