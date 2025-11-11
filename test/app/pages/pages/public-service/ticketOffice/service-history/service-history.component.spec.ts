import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ServiceHistoryComponent
} from '@pages/public-service/ticket-office/service-history/service-history.component';

describe(ServiceHistoryComponent.name, () => {
  let component: ServiceHistoryComponent;
  let fixture: ComponentFixture<ServiceHistoryComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceHistoryComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceHistoryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
