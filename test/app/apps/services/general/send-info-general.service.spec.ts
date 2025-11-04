import { TestBed } from '@angular/core/testing';
import { SendInfoGeneralService } from '@shared/services';


describe(SendInfoGeneralService.name , () => {
  let service: SendInfoGeneralService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendInfoGeneralService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

});
