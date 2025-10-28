import { TestBed } from '@angular/core/testing';
import { AttachmentService } from '@features/bpm-workflows/services/attachment.service';

describe(AttachmentService.name, () => {
  let service: AttachmentService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AttachmentService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
