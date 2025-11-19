import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  WorkflowProceduresComponent
} from '@pages/configuration/cadastral-procedures/workflow-procedures/workflow-procedures.component';

describe(WorkflowProceduresComponent.name, () => {
  let component: WorkflowProceduresComponent;
  let fixture: ComponentFixture<WorkflowProceduresComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkflowProceduresComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkflowProceduresComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
