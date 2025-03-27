import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  AddEditInformationAddressComponent
} from '../../../../../../../src/app/apps/components/information-property/information-addresses-property/add-edit-information-address/add-edit-information-address.component';

describe(AddEditInformationAddressComponent.name, () => {
  let component: AddEditInformationAddressComponent;
  let fixture: ComponentFixture<AddEditInformationAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddEditInformationAddressComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(AddEditInformationAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
