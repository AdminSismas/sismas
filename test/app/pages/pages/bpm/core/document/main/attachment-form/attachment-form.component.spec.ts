import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AttachmentFormComponent
} from '../../../../../../../../../src/app/pages/pages/bpm/core/document/main/attachment-form/attachment-form.component';

describe(AttachmentFormComponent.name, () => {
  let component: AttachmentFormComponent;
  let fixture: ComponentFixture<AttachmentFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
