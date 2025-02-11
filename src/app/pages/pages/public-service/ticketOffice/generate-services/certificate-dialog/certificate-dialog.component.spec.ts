import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateDialogComponent } from './certificate-dialog.component';

describe('CertificateDialogComponent', () => {
  let component: CertificateDialogComponent;
  let fixture: ComponentFixture<CertificateDialogComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateDialogComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
