import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ForgotPasswordComponent
} from '../../../../../../src/app/pages/pages/auth/forgot-password/forgot-password.component';
import { provideIcons } from '../../../../../../src/app/core/icons/icons.provider';
import { NoopAnimationsModule, provideNoopAnimations } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';


describe(ForgotPasswordComponent.name, () => {
  let component: ForgotPasswordComponent;
  let fixture: ComponentFixture<ForgotPasswordComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        ForgotPasswordComponent,
        NoopAnimationsModule,
        HttpClientModule,
      ],
      providers: [
        provideIcons(),
        provideNoopAnimations(),
        Router
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ForgotPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();

  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
