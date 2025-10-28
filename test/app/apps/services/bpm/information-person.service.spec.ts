import { TestBed } from '@angular/core/testing';
import { InformationPersonService } from '@features/bpm-workflows/services/information-person.service';


describe(InformationPersonService.name, () => {
  let service: InformationPersonService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(InformationPersonService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
