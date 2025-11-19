import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CertificateCardComponent } from '@pages

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
