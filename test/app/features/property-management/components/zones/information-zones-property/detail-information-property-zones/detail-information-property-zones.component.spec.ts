import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DetailInformationPropertyZonesComponent
} from '../../../../../../../src/app/apps/components/information-property/information-zones-property/detail-information-property-zones/detail-information-property-zones.component';

describe(DetailInformationPropertyZonesComponent.name, () => {
  let component: DetailInformationPropertyZonesComponent;
  let fixture: ComponentFixture<DetailInformationPropertyZonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailInformationPropertyZonesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailInformationPropertyZonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
