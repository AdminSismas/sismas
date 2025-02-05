import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CertificateDialogAvaluoComponent } from './certificate-dialog-avaluo.component';

describe('CertificateDialogAvaluoComponent', () => {
  let component: CertificateDialogAvaluoComponent;
  let fixture: ComponentFixture<CertificateDialogAvaluoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateDialogAvaluoComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(CertificateDialogAvaluoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
