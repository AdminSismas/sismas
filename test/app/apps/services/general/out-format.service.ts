import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { OutFormatService } from '@shared/services/general/out-format.service';

describe(OutFormatService.name, () => {
  let service: OutFormatService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(OutFormatService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

});
