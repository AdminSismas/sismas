import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  EconomicModConstructionComponent
} from '../../../../../../../src/app/pages/pages/configuration/cadastral/economic-mod-construction/economic-mod-construction.component';

describe(EconomicModConstructionComponent.name, () => {
  let component: EconomicModConstructionComponent;
  let fixture: ComponentFixture<EconomicModConstructionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EconomicModConstructionComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EconomicModConstructionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
