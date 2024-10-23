import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  GeoValidateComponent
} from '../../../../../../../../../src/app/pages/pages/bpm/core/cadastral/geo/validate/geo-validate.component';

describe(GeoValidateComponent.name, () => {
  let component: GeoValidateComponent;
  let fixture: ComponentFixture<GeoValidateComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeoValidateComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(GeoValidateComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
