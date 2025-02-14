import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { CollectionServices } from '../../../../../src/app/apps/services/general/collection.service';

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
