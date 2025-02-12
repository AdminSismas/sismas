import { HttpClientModule } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { DigitalizedSignaturesService } from 'src/app/apps/services/users/digitalized-signatures.service';


describe(DigitalizedSignaturesService.name, () => {
  let service: DigitalizedSignaturesService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ]
    });
    service = TestBed.inject(DigitalizedSignaturesService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
