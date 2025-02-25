import { TestBed } from '@angular/core/testing';
import { TitleService } from 'src/app/apps/services/general/tittle.service';


describe(TitleService.name, () => {
  let service: TitleService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TitleService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});

