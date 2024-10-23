import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  InformationConstructionsPropertyComponent
} from '../../../../../../src/app/apps/components/information-property/information-constructions-property/information-constructions-property.component';


describe(InformationConstructionsPropertyComponent.name, () => {
  let component: InformationConstructionsPropertyComponent;
  let fixture: ComponentFixture<InformationConstructionsPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [InformationConstructionsPropertyComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InformationConstructionsPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
