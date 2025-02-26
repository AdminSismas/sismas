import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CertificateDialogAvaluoComponent
} from '../../../../../../../../src/app/pages/pages/public-service/ticketOffice/generate-services/certificate-dialog-avaluo/certificate-dialog-avaluo.component';


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

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
