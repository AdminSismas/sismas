import { TestBed } from '@angular/core/testing';
import { SplashScreenService } from '@shared/services';

describe('SplashScreenService', () => {
  let service: SplashScreenService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SplashScreenService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
