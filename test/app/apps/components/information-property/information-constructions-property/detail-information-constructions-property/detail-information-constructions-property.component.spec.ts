import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DetailInformationConstructionsPropertyComponent
} from '../../../../../../../src/app/features/property-management/components/constructions/information-constructions-property/detail-information-constructions-property/detail-information-constructions-property.component';


describe(DetailInformationConstructionsPropertyComponent.name, () => {
  let component: DetailInformationConstructionsPropertyComponent;
  let fixture: ComponentFixture<DetailInformationConstructionsPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailInformationConstructionsPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailInformationConstructionsPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
