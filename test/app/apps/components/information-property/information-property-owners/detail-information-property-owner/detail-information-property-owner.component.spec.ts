import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DetailInformationPropertyOwnerComponent
} from '../../../../../../../src/app/apps/components/information-property/information-property-owners/detail-information-property-owner/detail-information-property-owner.component';


describe(DetailInformationPropertyOwnerComponent.name, () => {
  let component: DetailInformationPropertyOwnerComponent;
  let fixture: ComponentFixture<DetailInformationPropertyOwnerComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailInformationPropertyOwnerComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetailInformationPropertyOwnerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  test('should create', () => {
    expect(component).toBeTruthy();
  });
});
