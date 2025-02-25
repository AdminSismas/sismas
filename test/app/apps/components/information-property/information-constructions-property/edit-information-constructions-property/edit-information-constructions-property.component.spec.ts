import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditInformationConstructionsPropertyComponent } from './edit-information-constructions-property.component';

describe('EditInformationConstructionsPropertyComponent', () => {
  let component: EditInformationConstructionsPropertyComponent;
  let fixture: ComponentFixture<EditInformationConstructionsPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditInformationConstructionsPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditInformationConstructionsPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
