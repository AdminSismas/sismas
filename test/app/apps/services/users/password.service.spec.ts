import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { PasswordService } from 'src/app/apps/services/users/password.service';

describe(PasswordService.name, () => {
  let service: PasswordService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(PasswordService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
