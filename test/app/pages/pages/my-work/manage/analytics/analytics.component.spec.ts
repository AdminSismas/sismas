import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AnalyticsComponent
} from '@pages/my-work/manage/analytics/analytics.component';


describe(AnalyticsComponent.name, () => {
  let component: AnalyticsComponent;
  let fixture: ComponentFixture<AnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
