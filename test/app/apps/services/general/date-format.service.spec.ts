import { TestBed } from '@angular/core/testing';
import { DateFormatService } from '@shared/services';

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
