import { TestBed } from '@angular/core/testing';
import { AlfaMainService } from '@features/bpm-workflows/services/alfa-main/alfa-main.service';
describe(AlfaMainService.name, () => {
  let service: AlfaMainService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlfaMainService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
