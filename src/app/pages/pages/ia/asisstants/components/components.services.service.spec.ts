import { TestBed } from '@angular/core/testing';

import { ComponentsServicesService } from './components.services.service';

describe('ComponentsServicesService', () => {
  let service: ComponentsServicesService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ComponentsServicesService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
