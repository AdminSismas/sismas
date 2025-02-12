import { TestBed } from '@angular/core/testing';
import { SendInformationRegisterService } from 'src/app/apps/services/register-procedure/send-information-register.service';


describe(SendInformationRegisterService.name, () => {
  let service: SendInformationRegisterService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendInformationRegisterService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

});
