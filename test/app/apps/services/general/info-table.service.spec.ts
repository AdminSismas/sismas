
import { InfoTableService } from '../../../../../src/app/apps/services/general/info-table.service';
import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

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
