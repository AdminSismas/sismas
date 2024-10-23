import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  WorkFinishedComponent
} from '../../../../../../../src/app/pages/pages/operation-support/procedures/work-finished/work-finished.component';

describe(WorkFinishedComponent.name, () => {
  let component: WorkFinishedComponent;
  let fixture: ComponentFixture<WorkFinishedComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkFinishedComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkFinishedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
