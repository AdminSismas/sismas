import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ServicesRatesComponent
} from '../../../../../../../src/app/pages/pages/configuration/cadastral/services-rates/services-rates.component';

describe(ServicesRatesComponent.name, () => {
  let component: ServicesRatesComponent;
  let fixture: ComponentFixture<ServicesRatesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServicesRatesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServicesRatesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
