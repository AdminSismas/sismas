import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  WorkHistoricalComponent
} from '../../../../../../../src/app/pages/pages/operation-support/procedures/work-historical/work-historical.component';

describe('WorkHistoricalComponent', () => {
  let component: WorkHistoricalComponent;
  let fixture: ComponentFixture<WorkHistoricalComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WorkHistoricalComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WorkHistoricalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
