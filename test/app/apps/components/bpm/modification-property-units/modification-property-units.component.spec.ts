import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  ModificationPropertyUnitsComponent
} from '../../../../../../src/app/apps/components/bpm/modification-property-units/modification-property-units.component';


describe(ModificationPropertyUnitsComponent.name, () => {
  let component: ModificationPropertyUnitsComponent;
  let fixture: ComponentFixture<ModificationPropertyUnitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ModificationPropertyUnitsComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(ModificationPropertyUnitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
