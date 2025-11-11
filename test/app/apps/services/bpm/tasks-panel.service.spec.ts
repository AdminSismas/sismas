import { TestBed } from '@angular/core/testing';
import { TasksPanelService } from '@features/tasks/services/tasks-panel.service';


describe(TasksPanelService.name, () => {
  let service: TasksPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksPanelService);
  });

  test('should be created', () => {
    expect(service).toBeTruthy();
  });
});
