import { TestBed } from '@angular/core/testing';
import { AlertsService } from '../../../../../src/app/apps/services/alerts/alertes.service';
import { SendGeneralRequestsService } from '../../../../../src/app/apps/services/general/send-general-requests.service';
import { HttpClient } from '@angular/common/http';


describe(AlertsService.name, () => {
  let service: AlertsService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AlertsService
      ],
      providers: [SendGeneralRequestsService, HttpClient]
    }).compileComponents();
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
