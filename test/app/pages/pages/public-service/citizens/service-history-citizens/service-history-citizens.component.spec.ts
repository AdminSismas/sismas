import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ServiceHistoryCitizensComponent
} from '../../../../../../../src/app/pages/pages/public-service/citizens/service-history-citizens/service-history-citizens.component';

describe(ServiceHistoryCitizensComponent.name, () => {
  let component: ServiceHistoryCitizensComponent;
  let fixture: ComponentFixture<ServiceHistoryCitizensComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceHistoryCitizensComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceHistoryCitizensComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
