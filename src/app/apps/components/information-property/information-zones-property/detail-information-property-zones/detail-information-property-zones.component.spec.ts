import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetailInformationPropertyZonesComponent } from './detail-information-property-zones.component';

describe('DetailInformationPropertyZonesComponent', () => {
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

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
