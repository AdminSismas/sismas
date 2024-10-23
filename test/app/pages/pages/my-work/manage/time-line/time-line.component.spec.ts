import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  TimeLineComponent
} from '../../../../../../../src/app/pages/pages/my-work/manage/time-line/time-line.component';

describe(TimeLineComponent.name, () => {
  let component: TimeLineComponent;
  let fixture: ComponentFixture<TimeLineComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TimeLineComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TimeLineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
