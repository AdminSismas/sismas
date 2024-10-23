import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  InformationZonesPropertyComponent
} from '../../../../../../src/app/apps/components/information-property/information-zones-property/information-zones-property.component';

describe(InformationZonesPropertyComponent.name, () => {
  let component: InformationZonesPropertyComponent;
  let fixture: ComponentFixture<InformationZonesPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationZonesPropertyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InformationZonesPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
