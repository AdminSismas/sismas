import { TestBed } from '@angular/core/testing';
import { AuthService } from '@core/auth/auth.service';

describe(AuthService.name, () => {
  let service: AuthService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AuthService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
