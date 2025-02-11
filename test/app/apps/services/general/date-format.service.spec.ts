import { TestBed } from '@angular/core/testing';
import { DateFormatService } from '../../../../../src/app/apps/services/general/date-format.service';

describe(DateFormatService.name, () => {
  let service: DateFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DateFormatService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
