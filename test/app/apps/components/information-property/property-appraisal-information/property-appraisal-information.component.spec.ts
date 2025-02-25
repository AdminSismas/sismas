import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  PropertyAppraisalInformationComponent
} from '../../../../../../src/app/apps/components/information-property/property-appraisal-information/property-appraisal-information.component';


describe(PropertyAppraisalInformationComponent.name, () => {
  let component: PropertyAppraisalInformationComponent;
  let fixture: ComponentFixture<PropertyAppraisalInformationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PropertyAppraisalInformationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(PropertyAppraisalInformationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
