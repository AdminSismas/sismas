import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { UserService } from 'src/app/apps/services/users/user.service';

describe(UserService.name, () => {
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(UserService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });

});
