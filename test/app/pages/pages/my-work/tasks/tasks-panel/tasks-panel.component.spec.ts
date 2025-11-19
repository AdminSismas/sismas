import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TasksPanelComponent
} from '@pages/my-work/tasks/tasks-panel.component';
describe(TasksPanelComponent.name, () => {
  let component: TasksPanelComponent;
  let fixture: ComponentFixture<TasksPanelComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TasksPanelComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TasksPanelComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
