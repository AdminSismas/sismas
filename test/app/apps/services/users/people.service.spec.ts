import { TestBed } from '@angular/core/testing';
import { PeopleService } from 'src/app/apps/services/users/people.service';
import { SendGeneralRequestsService } from '../../../../../src/app/apps/services/general/send-general-requests.service';

describe(PeopleService.name, () => {
  let service: PeopleService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        PeopleService
      ],
      providers: [SendGeneralRequestsService]
    }).compileComponents();
  });

  beforeEach(() => {
    service = TestBed.inject(PeopleService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
