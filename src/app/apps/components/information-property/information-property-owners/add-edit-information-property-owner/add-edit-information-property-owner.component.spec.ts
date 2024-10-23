import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddEditInformationPropertyOwnerComponent } from './add-edit-information-property-owner.component';

describe('AddEditInformationPropertyOwnerComponent', () => {
  let component: AddEditInformationPropertyOwnerComponent;
  let fixture: ComponentFixture<AddEditInformationPropertyOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditInformationPropertyOwnerComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(AddEditInformationPropertyOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
