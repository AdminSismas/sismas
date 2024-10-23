import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  OperationalAnalyticsComponent
} from '../../../../../../src/app/pages/pages/operation-support/operational-analytics/operational-analytics.component';

describe(OperationalAnalyticsComponent.name, () => {
  let component: OperationalAnalyticsComponent;
  let fixture: ComponentFixture<OperationalAnalyticsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OperationalAnalyticsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OperationalAnalyticsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
