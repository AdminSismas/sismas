import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  IntegralEconomicModComponent
} from '@pages/configuration/cadastral/integral-economic-mod/integral-economic-mod.component';

describe(IntegralEconomicModComponent.name, () => {
  let component: IntegralEconomicModComponent;
  let fixture: ComponentFixture<IntegralEconomicModComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [IntegralEconomicModComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(IntegralEconomicModComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
