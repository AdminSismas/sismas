import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CalendarComponent } from '../../../../../../../src/app/pages/pages/my-work/manage/calendar/calendar.component';

describe(CalendarComponent.name, () => {
  let component: CalendarComponent;
  let fixture: ComponentFixture<CalendarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CalendarComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CalendarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
