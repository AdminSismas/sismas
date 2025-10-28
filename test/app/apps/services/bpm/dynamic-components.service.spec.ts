import { TestBed } from '@angular/core/testing';
import { DynamicComponentsService } from '@features/bpm-workflows/services/dynamic-components.service';

describe(DynamicComponentsService.name, () => {
  let service: DynamicComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicComponentsService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});

