import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInformationAddressComponent } from './edit-information-address.component';

describe('EditInformationAddressComponent', () => {
  let component: EditInformationAddressComponent;
  let fixture: ComponentFixture<EditInformationAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInformationAddressComponent]
    })
    .compileComponents();
    
    fixture = TestBed.createComponent(EditInformationAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
