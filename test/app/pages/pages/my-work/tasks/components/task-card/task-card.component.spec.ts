import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TaskCardComponent
} from '@features/tasks/components/task-card/task-card.component';

describe(TaskCardComponent.name, () => {
  let component: TaskCardComponent;
  let fixture: ComponentFixture<TaskCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TaskCardComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(TaskCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
