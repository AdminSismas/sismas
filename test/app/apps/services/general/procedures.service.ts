import { TestBed } from '@angular/core/testing';
import { ProceduresService } from '@shared/services';


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
