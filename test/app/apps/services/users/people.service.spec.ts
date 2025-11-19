import { TestBed } from '@angular/core/testing';
import { PeopleService } from 'src/app/apps/services/users/people.service';

describe(PeopleService.name, () => {
  let service: PeopleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PeopleService
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(PeopleService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
