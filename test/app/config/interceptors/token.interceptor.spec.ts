import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TokenInterceptor } from '../../../../src/app/config/interceptors/token.interceptor';
import { AuthService } from '../../../../src/app/pages/pages/auth/login/services/auth.service';

describe(TokenInterceptor.name, () => {
  let interceptor: TokenInterceptor;
  let fixture: ComponentFixture<TokenInterceptor>;
  let service: AuthService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TokenInterceptor],
      providers: [AuthService ]
    }) .compileComponents();
  });

  beforeEach(() => {
    interceptor = TestBed.inject(TokenInterceptor);
    fixture = TestBed.createComponent(TokenInterceptor);
    service = TestBed.inject(AuthService);

    fixture.detectChanges();
  });

  test('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
