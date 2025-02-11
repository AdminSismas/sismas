import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AddEditInformationPropertyOwnerComponent } from 'src/app/apps/components/information-property/information-property-owners/add-edit-information-property-owner/add-edit-information-property-owner.component';

describe(AddEditInformationPropertyOwnerComponent.name, () => {
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

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
