
import { TestBed } from '@angular/core/testing';
import { PhotosService } from 'src/app/apps/services/photos/photos.service';


describe(PhotosService.name, () => {
  let service: PhotosService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(PhotosService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
