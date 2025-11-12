import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  WorkAssignmentComponent
} from '@pages/operation-support/work-assignment/work-assignment.component';

describe(WorkAssignmentComponent.name, () => {
  let component: WorkAssignmentComponent;
  let fixture: ComponentFixture<WorkAssignmentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkAssignmentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkAssignmentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
