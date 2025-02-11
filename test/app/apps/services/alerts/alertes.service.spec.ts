import { TestBed } from '@angular/core/testing';
import { AlertsService } from '../../../../../src/app/apps/services/alerts/alertes.service';


describe(AlertsService.name, () => {
  let service: AlertsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AlertsService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
