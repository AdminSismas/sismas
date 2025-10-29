import { TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { CollectionServices } from '@shared/services';

describe(CollectionServices.name, () => {
  let service: CollectionServices;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(CollectionServices);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
