import { TestBed } from '@angular/core/testing';
import { UserService } from '../../../../../../../src/app/pages/pages/auth/login/services/user.service';

describe(UserService.name, () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(UserService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
