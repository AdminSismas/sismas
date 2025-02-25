import { TestBed } from '@angular/core/testing';
import { InformationPersonService } from '../../../../../src/app/apps/services/bpm/information-person.service';


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
