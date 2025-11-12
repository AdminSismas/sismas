import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AttachmentExcelMassiveComponent } from './attachment-excel-massive.component';

describe('AttachmentExelMassiveComponent', () => {
  let component: AttachmentExcelMassiveComponent;
  let fixture: ComponentFixture<AttachmentExcelMassiveComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AttachmentExcelMassiveComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AttachmentExcelMassiveComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
