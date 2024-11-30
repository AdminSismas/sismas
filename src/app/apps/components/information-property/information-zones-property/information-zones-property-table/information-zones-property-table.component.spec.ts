import { ComponentFixture, TestBed } from '@angular/core/testing';

import { InformationZonesPropertyTableComponent } from './information-zones-property-table.component';

describe('InformationZonesPropertyTableComponent', () => {
  let component: InformationZonesPropertyTableComponent;
  let fixture: ComponentFixture<InformationZonesPropertyTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationZonesPropertyTableComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(InformationZonesPropertyTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
