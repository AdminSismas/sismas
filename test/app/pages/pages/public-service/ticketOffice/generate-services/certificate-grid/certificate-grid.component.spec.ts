import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  CertificateGridComponent
} from '@pages/public-service/ticket-office/generate-services/certificate-grid/certificate-grid.component';


describe('CertificateGridComponent', () => {
  let component: CertificateGridComponent;
  let fixture: ComponentFixture<CertificateGridComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CertificateGridComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CertificateGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
