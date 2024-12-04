import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInformatizonZonesPropertyComponent } from './add-edit-informatizon-zones-property.component';

describe('AddEditInformatizonZonesPropertyComponent', () => {
  let component: AddEditInformatizonZonesPropertyComponent;
  let fixture: ComponentFixture<AddEditInformatizonZonesPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditInformatizonZonesPropertyComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditInformatizonZonesPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
