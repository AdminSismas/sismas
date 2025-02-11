import { TestBed } from '@angular/core/testing';

import { AttachmentService } from './attachment.service';

describe('AttachmentService', () => {
  let service: AttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachmentService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
