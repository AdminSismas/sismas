import { TestBed } from '@angular/core/testing';
import { TasksPanelService } from '../../../../../src/app/apps/services/bpm/tasks-panel.service';


describe(TasksPanelService.name, () => {
  let service: TasksPanelService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TasksPanelService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
