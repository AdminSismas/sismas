import { TestBed } from '@angular/core/testing';
import { HttpClientModule, HttpInterceptorFn } from '@angular/common/http';
import { authInterceptor } from '../../../../../../../src/app/pages/pages/auth/login/services/auth.interceptor';


describe(authInterceptor.name, () => {
  const interceptor: HttpInterceptorFn = (req, next) =>
    TestBed.runInInjectionContext(() => authInterceptor(req, next));

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
  });

  test('should be created', () => {
    expect(interceptor).toBeTruthy();
  });
});
