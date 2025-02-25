import { TestBed } from '@angular/core/testing';
import { SendInfoGeneralService } from 'src/app/apps/services/general/send-info-general.service';


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
