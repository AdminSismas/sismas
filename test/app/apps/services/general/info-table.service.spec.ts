import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { InfoTableService } from '@shared/services';

describe(InfoTableService.name, () => {
  let service: InfoTableService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(InfoTableService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
