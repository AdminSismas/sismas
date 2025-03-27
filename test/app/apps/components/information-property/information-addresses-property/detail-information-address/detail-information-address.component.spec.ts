import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  DetailInformationAddressComponent
} from '../../../../../../../src/app/apps/components/information-property/information-addresses-property/detail-information-address/detail-information-address.component';

describe(DetailInformationAddressComponent.name, () => {
  let component: DetailInformationAddressComponent;
  let fixture: ComponentFixture<DetailInformationAddressComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetailInformationAddressComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(DetailInformationAddressComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
