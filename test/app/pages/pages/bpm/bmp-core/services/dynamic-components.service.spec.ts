import { TestBed } from '@angular/core/testing';
import {
  DynamicComponentsService
} from '../../../../../../../src/app/apps/services/bpm/dynamic-components.service';

describe(DynamicComponentsService.name, () => {
  let service: DynamicComponentsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DynamicComponentsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
