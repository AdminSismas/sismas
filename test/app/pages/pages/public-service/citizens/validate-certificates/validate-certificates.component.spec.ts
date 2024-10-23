import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ValidateCertificatesComponent
} from '../../../../../../../src/app/pages/pages/public-service/citizens/validate-certificates/validate-certificates.component';

describe(ValidateCertificatesComponent.name, () => {
  let component: ValidateCertificatesComponent;
  let fixture: ComponentFixture<ValidateCertificatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ValidateCertificatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ValidateCertificatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
