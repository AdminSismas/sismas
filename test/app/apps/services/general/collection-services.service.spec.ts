import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CollectionServicesService } from '../../../../../src/app/apps/services/general/collection-services.service';

describe(CollectionServicesService.name, () => {
  let service: CollectionServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(CollectionServicesService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
