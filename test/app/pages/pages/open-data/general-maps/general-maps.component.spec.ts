import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  GeneralMapsComponent
} from '../../../../../../src/app/pages/pages/open-data/general-maps/general-maps.component';

describe(GeneralMapsComponent.name, () => {
  let component: GeneralMapsComponent;
  let fixture: ComponentFixture<GeneralMapsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeneralMapsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeneralMapsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
