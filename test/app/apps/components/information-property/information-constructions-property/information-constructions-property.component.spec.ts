import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  InformationConstructionsPropertyComponent
} from '../../../../../../src/app/apps/components/information-property/information-constructions-property/information-constructions-property.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';


describe(InformationConstructionsPropertyComponent.name, () => {
  let component: InformationConstructionsPropertyComponent;
  let fixture: ComponentFixture<InformationConstructionsPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        InformationConstructionsPropertyComponent, NoopAnimationsModule
      ]
    })
      .compileComponents();

    fixture = TestBed.createComponent(InformationConstructionsPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
