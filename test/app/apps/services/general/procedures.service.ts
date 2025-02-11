import { TestBed } from '@angular/core/testing';
import { ProceduresService } from '../../../../../src/app/apps/services/general/procedures.service';


describe(ProceduresService.name, () => {
  let service: ProceduresService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ProceduresService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
