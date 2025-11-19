import { TestBed } from '@angular/core/testing';
import { ProcedureWorkFinishedService } from '@shared/services';


describe(ProcedureWorkFinishedService.name, () => {
  let service: ProcedureWorkFinishedService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProcedureWorkFinishedService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
