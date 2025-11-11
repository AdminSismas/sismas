import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  WorkProgressComponent
} from '@pages/operation-support/procedures/work-progress/work-progress.component';

describe(WorkProgressComponent.name, () => {
  let component: WorkProgressComponent;
  let fixture: ComponentFixture<WorkProgressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkProgressComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkProgressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
