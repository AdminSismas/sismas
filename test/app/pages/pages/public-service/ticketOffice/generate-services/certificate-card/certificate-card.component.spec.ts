import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificateCardComponent } from 'src/app/pages/pages/public-service/ticketOffice/generate-services/certificate-card/certificate-card.component';

describe('CertificateCardComponent', () => {
  let component: CertificateCardComponent;
  let fixture: ComponentFixture<CertificateCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateCardComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
