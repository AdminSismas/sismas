import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CrudInformationConstructionsPropertyComponent } from 'src/app/apps/components/information-property/information-constructions-property/crud-information-constructions-property/crud-information-constructions-property.component';


describe(CrudInformationConstructionsPropertyComponent.name, () => {
  let component: CrudInformationConstructionsPropertyComponent;
  let fixture: ComponentFixture<CrudInformationConstructionsPropertyComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CrudInformationConstructionsPropertyComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CrudInformationConstructionsPropertyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
