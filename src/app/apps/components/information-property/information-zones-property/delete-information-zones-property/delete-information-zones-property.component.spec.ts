import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DeleteInformationZonesPropertyComponent } from './delete-information-zones-property.component';

describe('DeleteInformationZonesPropertyComponent', () => {
  let component: DeleteInformationZonesPropertyComponent;
  let fixture: ComponentFixture<DeleteInformationZonesPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DeleteInformationZonesPropertyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(DeleteInformationZonesPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
