import { TestBed } from '@angular/core/testing';
import { AlertsService } from '@features/property-management/services/alerts/alertes.service';
import { HttpClient } from '@angular/common/http';


describe(AlertsService.name, () => {

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AlertsService
      ],
      providers: [HttpClient]
    }).compileComponents();
  });
});
