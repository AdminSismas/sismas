import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  EconomicModLandComponent
} from '@pages/configuration/cadastral/economic-mod-land/economic-mod-land.component';

describe(EconomicModLandComponent.name, () => {
  let component: EconomicModLandComponent;
  let fixture: ComponentFixture<EconomicModLandComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomicModLandComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomicModLandComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
